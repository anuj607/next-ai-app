import {
    streamText,
    UIMessage,
    convertToModelMessages,
    tool,
    InferUITools,
    UIDataTypes,
    stepCountIs,
  } from "ai";
  import { openai } from "@ai-sdk/openai";
  import { z } from "zod";
  
  
  const tools = {
    getWeather: tool({
      description: "Get the weather for a location",
      inputSchema: z.object({
        city: z.string().describe("The city to get the weather for"),
      }),
      execute: async ({ city }) => {
        console.log('city=',city);
        console.log(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`)
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`)
        const data = await response.json();
        const weatherData={
            location:{
                name:data.location.name,
                country:data.location.country,
                localtime:data.location.localtime
            },
            current:{
                temp_c:data.current.temp_c,
                condition:{
                    text:data.current.condition.text,
                    code:data.current.condition.code,
                }
            }
        }
        return weatherData;
      }
      
    }),
  };
  
  export type ChatTools = InferUITools<typeof tools>;
  export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;
  
  export async function POST1(req: Request) {
    try {
      const { messages }: { messages: ChatMessage[] } = await req.json();
    console.log('messages',messages);//return false;
      const result = streamText({
        //model: openai("gpt-5-mini"),
        model:openai('gpt-4.1-nano'),
        messages: convertToModelMessages(messages),
        tools,
        stopWhen: stepCountIs(2),
      });
  
      return result.toUIMessageStreamResponse();
    } catch (error) {
      console.error("Error streaming chat completion:", error);
      return new Response("Failed to stream chat completion", { status: 500 });
    }
  }
  export async function POST(req: Request) {
    const { messages }: { messages: ChatMessage[] } = await req.json();
    const result = streamText({
      model: openai("gpt-5-nano"),
      messages: convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });
  
    return result.toUIMessageStreamResponse();
  }