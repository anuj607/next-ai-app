"use client";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useState } from "react";


export default function structuredEnumPage() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
   


  const analyzeSentiment = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setText("");

    try {
      const response = await fetch("/api/structured-enum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSentiment(data);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div className="flex flex-col w-full max-w-2xl pt-12 pb-24 mx-auto">
         {isLoading ? (
        <div className="text-center">Analyzing sentiment...</div>
      ) : sentiment ? (
        <div className="text-center">
          <div className="text-3xl font-bold">
            {sentiment === "positive" && "😊 Positive"}
            {sentiment === "negative" && "😞 Negative"}
            {sentiment === "neutral" && "😐 Neutral"}
          </div>
        </div>
      ) : null}
    
          <form
            onSubmit={analyzeSentiment}
            className="fixed bottom-0 w-full max-w-2xl mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter a type..."
                className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
              />
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !text.trim()}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate
                </button>
              )}
            </div>
          </form>
        </div>
      );
    
}