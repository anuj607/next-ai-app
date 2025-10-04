"use client";

import { useCompletion } from "@ai-sdk/react";
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
export default function StreamPage() {
    const { messages, sendMessage, status, error, stop } = useChat();
    const [input, setInput] = useState("");
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput("")
    }

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">


            {
                messages.map((message) => (
                    <div key={message.id}>
                        <div>{message.role === "user" ? "You:" : "AI:"}</div>
                        {
                            message.parts.map((part, index) => {
                                switch (part.type) {
                                    case "text":
                                        return <div key={`${message.id}-${index}`}>{part.text}</div>;
                                    default:
                                        return null;
                                }
                            })
                        }
                    </div>
                ))
            }

            {

            }
            {error && <div className="text-red-500 mb-4">{error.message}</div>}
            {/* {isLoading && !completion && <div>Loading ...</div>}
           {completion && <div className="whitespace-pre-wrap">{completion}</div>} */}
            <form
                onSubmit={handleSubmit}
                className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
            >
                <div className="flex gap-2">
                    <input
                        className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="How can I help you?"
                    />

                    {
                        status === 'submitted' || status === 'streaming' ? (
                            <button onClick={stop}
                                className="bg-red-500">
                                Stop
                            </button>
                        ) : <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={status !== 'ready'}
                        >
                            Send
                        </button>
                    }

                </div>
            </form>
        </div>
    );
}