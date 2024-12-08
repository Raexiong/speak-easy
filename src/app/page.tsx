"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EntryPage() {
  const [showInput, setShowInput] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !showInput) {
        setShowInput(true);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [showInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/validate-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push("/sign-in");
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
        setPassword("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <h1 className="text-neutral-800 text-lg mb-4 text-center">
          Find your way in
        </h1>

        {!showInput && (
          <p className="text-neutral-800 text-sm absolute bottom-4 left-1/2 transform -translate-x-1/2">
            {/* Subtle hint that only appears after 5 seconds */}
            <span className="opacity-50">Press Enter to begin...</span>
          </p>
        )}

        {showInput && (
          <form onSubmit={handleSubmit} className="px-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-transparent border-b ${
                error ? "border-red-500" : "border-neutral-800"
              } text-neutral-400 px-4 py-2 focus:outline-none focus:border-neutral-600 transition-colors`}
              placeholder="Enter the code"
              autoFocus
            />
          </form>
        )}
      </div>
    </div>
  );
}
