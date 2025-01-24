"use client";

import { useState } from "react";
import axios from "../../../utils/axios"; // Assuming this is your configured Axios instance

export default function GeneratePptPage() {
    const [formData, setFormData] = useState({
        topic: "",
        yearLevel: "",
        objectives: "",
        course: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        setDownloadUrl("");

        try {
            const response = await axios.post("/generate-ppt", formData, {
                responseType: "blob", // Ensures we get a binary file response
            });

            // Create a blob URL for downloading the file
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            });
            const url = window.URL.createObjectURL(blob);

            setDownloadUrl(url);
            setSuccess("PowerPoint generated successfully! Click below to download.");
        } catch (err) {
            console.error("Error generating PowerPoint:", err);
            setError("Failed to generate PowerPoint. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Generate PowerPoint with AI</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Topic:
                        <input
                            type="text"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Year Level:
                        <input
                            type="text"
                            name="yearLevel"
                            value={formData.yearLevel}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Learning Objectives (separated by semicolon):
                        <textarea
                            name="objectives"
                            value={formData.objectives}
                            onChange={handleChange}
                            placeholder="Objective 1; Objective 2; ..."
                            required
                        ></textarea>
                    </label>
                </div>
                <div>
                    <label>
                        Course:
                        <input
                            type="text"
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Generating..." : "Generate PowerPoint"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && (
                <div>
                    <p style={{ color: "green" }}>{success}</p>
                    <a href={downloadUrl} download="Generated_PowerPoint.pptx">
                        Download PowerPoint
                    </a>
                </div>
            )}
        </div>
    );
}
