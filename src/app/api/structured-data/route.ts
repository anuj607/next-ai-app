import {streamObject} from 'ai';
import {openai} from '@ai-sdk/openai';
import {recipeSchema} from './recipe.schema'

export async function POST(req:Request){
    try{
        const {dish} = await req.json();
        const result = await streamObject({
            model:openai('gpt-4.1-nano'),
            schema:recipeSchema,
            prompt:`Generate a recipe for ${dish}`
        })
        
        return result.toTextStreamResponse();
    }catch(error){
        console.error("Error generating text:",error)
        return Response.json({error:"Failed to generate text"},{status:500})
    }
    
}