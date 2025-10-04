"use client";
import { useState } from "react";
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { recipeSchema } from "@/app/api/structured-data/recipe.schema";

export default function StructuredData() {

    const [dish, setDish] = useState("");

    const { submit, object } = useObject({
        api: "/api/structured-data",
        schema: recipeSchema,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit({ dish: dish });
        setDish("");
    }

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            {object?.recipe && (
                <div className="space-y-6 px-4">
                    <h2 className="text-2xl font-bold">{object.recipe.name}</h2>

                    {object?.recipe?.ingredients && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {object.recipe.ingredients.map((ingredient, index) => (
                                    <div
                                        key={index}
                                        className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg"
                                    >
                                        <p className="font-medium">{ingredient?.name}</p>
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            {ingredient?.amount}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {object?.recipe?.steps && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Steps</h3>
                            <ol className="space-y-4">
                                {object.recipe.steps.map((step, index) => (
                                    <li
                                        key={index}
                                        className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg"
                                    >
                                        <span className="font-medium mr-2">{index + 1}.</span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
            >
                <div className="flex gap-2">
                    <input
                        className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
                        value={dish}
                        onChange={(e) => setDish(e.target.value)}
                        placeholder="How can I help you?"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}