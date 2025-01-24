"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Welcome to SmartSeats</h1>
      <p className="text-lg text-gray-700 mb-10">Choose where you'd like to go:</p>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/classes")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Manage Classes
        </button>
        <button
          onClick={() => router.push("/openai/ppt")}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Generate AI PowerPoint
        </button>
        {/* Add more navigation options here as needed */}
      </div>
    </div>
  );
}
