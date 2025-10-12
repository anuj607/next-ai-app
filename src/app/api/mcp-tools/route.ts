import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
  experimental_createMCPClient
} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";


const tools = {
  getWeather: tool({
    description: "Get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      if (city === "Gotham City") {
        return "70°F and cloudy";
      } else if (city === "Metropolis") {
        return "80°F and sunny";
      } else {
        return "Unknown";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const mockmcpToken=process.env.MOCK_MCP_TOKEN;
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();
    const httpChatTransport = new StreamableHTTPClientTransport(
      new URL("https://app.mockmcp.com/servers/k5dMoO_9IKaM/mcp"),{
        requestInit:{
          headers:{
            Authorization:"Bearer "+mockmcpToken
          }
        }
      }
    )

    const mcpClient = await experimental_createMCPClient({
      transport: httpChatTransport,
    });

    const mcpTools = await mcpClient.tools();

    const result = streamText({
      //model: openai("gpt-5-mini"),
      model:openai('gpt-4.1-nano'),
      messages: convertToModelMessages(messages),
      tools:{
        ...mcpTools,...tools
      },
      stopWhen: stepCountIs(2),
      onFinish:async()=>{
        await mcpClient.close()
      },
      onError:async(error)=>{
        await mcpClient.close()
        console.error("Error during streaming",error)
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}