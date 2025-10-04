import { UIMessage, streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';


export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json();
        const result = await streamText({
            model: openai('gpt-4.1-nano'),
            messages: convertToModelMessages(messages)
        })
        result.usage.then((usage) => {
            console.log({
                messagesCount: messages.length,
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