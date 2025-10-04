import {generateText} from 'ai';
import {openai} from '@ai-sdk/openai';


export async function POST(req){
    try{
        const {prompt} = await req.json();
        console.log('promt',prompt)
        const {text} = await generateText({
            model:openai('gpt-4.1-nano'),
            prompt
        })
        console.log('text',text)
        return Response.json({text})
    }catch(error){
        console.error("Error generating text:",error)
        return Response.json({error:"Failed to generate text"},{status:500})
    }
    
}