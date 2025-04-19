import { NextResponse } from 'next/server';
import { ElevenLabsClient } from "elevenlabs";
export async function POST(request: Request) {
  try {
    const elevenLabsClient = new ElevenLabsClient();

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const audio = await elevenLabsClient.generate({
      voice: `${process.env.ELEVENLABS_VOICE_ID}`,
      text,
      model_id: "eleven_turbo_v2_5",
    });

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    return new Response(audio as any, {
      headers: { "Content-Type": "audio/mpeg" }
    });

  } catch (error) {
    console.error('Error generating voice:', error);
    return NextResponse.json(
      { error: 'Failed to generate voice' },
      { status: 500 }
    );
  }
}