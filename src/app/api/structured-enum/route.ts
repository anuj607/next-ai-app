import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        const result = await generateObject({
            model: openai('gpt-4.1-mini'),
            output: "enum",
            enum: ["positive", "negative", "neutral"],
            prompt: `clasify the sentiment in this "${text}"`

        });
        return result.toJsonResponse();
    } catch (e) {console.log('e',e)
        return new Response("Failed to generate pokemon", { status: 500 })
    }

}