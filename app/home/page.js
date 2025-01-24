"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    return (
        <div>
            <h1>Welcome to SmartSeats</h1>
            <p>Choose where you'd like to go:</p>
            <div>
                <button onClick={() => router.push("/classes")}>Manage Classes</button>
                <button onClick={() => router.push("/openai/ppt")}>Generate AI PowerPoint</button>
                {/* Add more navigation options here as needed */}
            </div>
        </div>
    );
}
