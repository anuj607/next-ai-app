import { openai } from "@ai-sdk/openai";
import { experimental_generateSpeech as generateSpeech } from "ai";


export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        const { audio } = await generateSpeech({
            model: openai.speech("tts-1"),
            text,
        });

        return new Response(audio.uint8Array, {
            headers: {
                "Content-Type": audio.mediaType || "audio/mpeg"
            }
        })
    } catch (e) {
        console.error("Error generating image:", e);
        return new Response("Failed to generate audio speech", { status: 500 });
    }

}