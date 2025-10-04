import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
export const runtime = "edge"; // important for streaming
export async function POST(req) {
    try {
        const { prompt } = await req.json();
        const result = await streamText({
            model: openai('gpt-4.1-nano'),
            //model: anthropic('claude-sonnet-4-20250514'),
            prompt
        })

        result.usage.then((usage) => {
            console.log({
                inputTokens: usage.inputTokens,
                outputTokens: usage.outputTokens,
                totalToken: usage.totalTokens
            })
        });
        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Error generating text:", error)
        return Response.json({ error: "Failed to generate text" }, { status: 500 })
    }

}