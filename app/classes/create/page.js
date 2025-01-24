"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../../../utils/axios";

const CreateClassPage = () => {
    const [className, setClassName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the page from refreshing

        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("UserId is missing. Please log in again.");
            }

            // Send the class name to the backend
            await axios.post("/classes", {
                name: className,
                description: description,
                userId: userId,
            });

            // Redirect to /classes after successful creation
            alert("Class created successfully!");
            router.push("/classes");
        } catch (err) {
            console.error("Error creating class:", err);
            setError("Failed to create class. Please try again.");
        }
    };

    return (
        <div>
            <h1>Create a New Class</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Class Name:
                    <input
                        type="text"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                    />
                </label>
                <div>
                    <label>
                        Description: {/* new field for description */}
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter a brief description of the class"
                            required
                            ></textarea>
                    </label>
                </div>
                <button type="submit">Create Class</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default CreateClassPage;
