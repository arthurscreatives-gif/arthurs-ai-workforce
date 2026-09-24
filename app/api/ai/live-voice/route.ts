import { NextRequest, NextResponse } from 'next/server';
import { Modality, LiveServerMessage } from '@google/genai';
import { getGeminiClient, checkDailyQuota, recordUsage } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      audioBase64,
      text,
      voiceName = 'Zephyr', // 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr'
      systemInstruction = 'You are the intelligent AI Voice Receptionist for Arthur’s AI Workforce. Speak clearly, concisely, and professionally to assist callers with appointment scheduling, customer inquiries, and business operations.',
    } = body;

    if (!audioBase64 && !text) {
      return NextResponse.json(
        { error: 'Either audioBase64 (16kHz PCM) or text is required for voice conversation.' },
        { status: 400 }
      );
    }

    const quota = checkDailyQuota();
    if (!quota.allowed) {
      return NextResponse.json(
        { error: `Daily AI quota reached (${quota.dailyRequests}/${quota.maxDailyRequests}).`, quota },
        { status: 429 }
      );
    }

    const ai = getGeminiClient();
    if (!ai) {
      return NextResponse.json(
        { error: 'Gemini API client is not configured. Please check GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    // Connect to Live API model: gemini-3.8-live
    return new Promise<NextResponse>((resolve) => {
      let resolved = false;
      const audioChunks: string[] = [];
      let transcriptText = '';
      let isInterrupted = false;

      // Timeout safety: 12 seconds max for live voice turn
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          if (audioChunks.length > 0) {
            resolve(
              NextResponse.json({
                audio: audioChunks.join(''),
                audioChunks,
                transcript: transcriptText || 'Voice response completed.',
                model: 'gemini-3.8-live',
                voice: voiceName,
                interrupted: isInterrupted,
              })
            );
          } else {
            resolve(
              NextResponse.json(
                {
                  error: 'Live API connection timed out. Please try speaking again.',
                  model: 'gemini-3.8-live',
                },
                { status: 504 }
              )
            );
          }
        }
      }, 12000);

      try {
        ai.live
          .connect({
            model: 'gemini-3.8-live',
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: (voiceName as 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr') || 'Zephyr',
                  },
                },
              },
              systemInstruction,
            },
            callbacks: {
              onmessage: (message: LiveServerMessage) => {
                // Collect audio data (24kHz PCM from model turn)
                const parts = message.serverContent?.modelTurn?.parts;
                if (parts && parts.length > 0) {
                  for (const part of parts) {
                    if (part.inlineData?.data) {
                      audioChunks.push(part.inlineData.data);
                    }
                    if (part.text) {
                      transcriptText += part.text;
                    }
                  }
                }

                if (message.serverContent?.interrupted) {
                  isInterrupted = true;
                }

                // If turn is complete
                if (message.serverContent?.turnComplete) {
                  if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    recordUsage(300);
                    resolve(
                      NextResponse.json({
                        audio: audioChunks.join(''),
                        audioChunks,
                        transcript: transcriptText || 'Voice response received from gemini-3.8-live.',
                        model: 'gemini-3.8-live',
                        voice: voiceName,
                        interrupted: isInterrupted,
                        sampleRate: 24000,
                      })
                    );
                  }
                }
              },
              onclose: () => {
                if (!resolved) {
                  resolved = true;
                  clearTimeout(timeoutId);
                  resolve(
                    NextResponse.json({
                      audio: audioChunks.join(''),
                      audioChunks,
                      transcript: transcriptText || 'Voice stream ended.',
                      model: 'gemini-3.8-live',
                      voice: voiceName,
                      interrupted: isInterrupted,
                      sampleRate: 24000,
                    })
                  );
                }
              },
              onerror: (err: any) => {
                console.error('Live API callback error:', err);
                if (!resolved) {
                  resolved = true;
                  clearTimeout(timeoutId);
                  // Provide graceful response if some audio was received
                  if (audioChunks.length > 0) {
                    resolve(
                      NextResponse.json({
                        audio: audioChunks.join(''),
                        audioChunks,
                        transcript: transcriptText,
                        model: 'gemini-3.8-live',
                        voice: voiceName,
                      })
                    );
                  } else {
                    resolve(
                      NextResponse.json(
                        { error: err?.message || 'Error occurred during Live API session.' },
                        { status: 500 }
                      )
                    );
                  }
                }
              },
            },
          })
          .then((session) => {
            // Send user input to the Live session
            if (audioBase64) {
              session.sendRealtimeInput({
                audio: { data: audioBase64, mimeType: 'audio/pcm;rate=16000' },
              });
            } else if (text) {
              session.sendRealtimeInput({ text });
            }
          })
          .catch((err) => {
            console.error('Failed to initiate ai.live.connect:', err);
            if (!resolved) {
              resolved = true;
              clearTimeout(timeoutId);
              resolve(
                NextResponse.json(
                  { error: `Live API connection failed: ${err.message || err}` },
                  { status: 500 }
                )
              );
            }
          });
      } catch (err: any) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(
            NextResponse.json(
              { error: `Exception starting Live session: ${err.message || err}` },
              { status: 500 }
            )
          );
        }
      }
    });
  } catch (error) {
    console.error('Error in live-voice route:', error);
    const message = error instanceof Error ? error.message : 'Live voice processing failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
