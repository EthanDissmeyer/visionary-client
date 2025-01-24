"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "../../../utils/axios"; // baseURL = "http://localhost:5000/api"

export default function ClassDetailsPage() {
  const { id } = useParams(); // Dynamic route: [id]
  const router = useRouter();

  // Class data
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update class name
  const [updatedName, setUpdatedName] = useState("");

  // Update class description
  const [updatedDescription, setUpdatedDescription] = useState("");

  // For searching students (type-ahead)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // For adding tests
  const [newTest, setNewTest] = useState({
    testName: "",
    subject: "",
    date: "",
  });

  // 1) Fetch the class info
  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const response = await axios.get(`/classes/${id}`);
        setClassInfo(response.data);
      } catch (err) {
        console.error("Error fetching class info:", err);
        setError("Failed to load class information.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClassInfo();
  }, [id]);

  // 2) Debounced search for students by name
  useEffect(() => {
    const doSearch = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(`/students/search?q=${searchTerm}`);
        setSearchResults(res.data); // Array of { _id, name, ... }
      } catch (err) {
        console.error("Error searching students:", err);
      }
    };
    const delay = setTimeout(doSearch, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // 3) Immediately add student when clicked
  const handleAddStudent = async (studentId) => {
    try {
      const response = await axios.post("/classes/students", {
        classId: id,
        studentIds: [studentId],
      });
      alert("Student added successfully!");
      // Update local class info with the new list
      setClassInfo(response.data.class);

      // Clear search
      setSearchTerm("");
      setSearchResults([]);
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Failed to add student.");
    }
  };

  // Add a test
  const handleAddTest = async () => {
    try {
      const response = await axios.post("/classes/tests", {
        classId: id,
        ...newTest,
      });
      alert("Test added successfully!");
      setClassInfo((prev) => ({
        ...prev,
        tests: [...(prev.tests || []), response.data.test],
      }));
      // Reset test inputs
      setNewTest({ testName: "", subject: "", date: "" });
    } catch (err) {
      console.error("Error adding test:", err);
      alert("Failed to add test.");
    }
  };

  // Update class name
  const handleUpdateClassInfo = async () => {
    try {
      const response = await axios.put(`/classes/${id}`, {
        name: updatedName || classInfo.name,
        description: updatedDescription || classInfo.description,
      });
      alert("Class info updated successfully!");
      setClassInfo(response.data.class);
      setUpdatedName("");
      setUpdatedDescription("");
    } catch (err) {
      console.error("Error updating class info:", err);
      alert("Failed to update class.");
    }
  };

  // Delete class
  const handleDeleteClass = async () => {
    try {
      await axios.delete(`/classes/${id}`);
      alert("Class deleted successfully!");
      router.push("/classes");
    } catch (err) {
      console.error("Error deleting class:", err);
      alert("Failed to delete class.");
    }
  };

  // Delete a test
  const handleDeleteTest = async (testId) => {
    try {
      const response = await axios.delete(`/classes/${id}/${testId}`);
      alert("Test deleted successfully!");
      setClassInfo(response.data.class);
    } catch (err) {
      console.error("Error deleting test:", err);
      alert("Failed to delete test.");
    }
  };

  if (loading) return <p>Loading class information...</p>;
  if (error) return <p>{error}</p>;
  if (!classInfo) return <p>Class not found.</p>;

  return (
    <div>
      {/* Back nav */}
      <button onClick={() => router.push("/classes")}>Back to Classes</button>

      <h1>Class: {classInfo.name}</h1>
      <p>Description: {classInfo.description || "No description provided."}</p>

      <h2>Actions</h2>

      {/* Type-ahead: no dropdown, no separate button */}
      <div>
        <h3>Add Student by Name</h3>
        <input
          type="text"
          placeholder="Type a name to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul style={{ border: "1px solid #ccc", listStyle: "none", padding: "4px" }}>
            {searchResults.map((student) => (
              <li
                key={student._id}
                style={{ cursor: "pointer", padding: "4px 0" }}
                onClick={() => handleAddStudent(student._id)}
              >
                {student.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Test */}
      <div>
        <h3>Add Test</h3>
        <input
          type="text"
          placeholder="Test Name"
          value={newTest.testName}
          onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Subject"
          value={newTest.subject}
          onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
        />
        <input
          type="date"
          value={newTest.date}
          onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
        />
        <button onClick={handleAddTest}>Add Test</button>
      </div>

      {/* Update Class Name */}
      <div>
        <h3>Update Class Name</h3>
        <input
          type="text"
          placeholder="New Class Name"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
        />
        <button onClick={handleUpdateClassInfo}>Update Class</button>
      </div>

      {/* Update Class Description */}
      <div>
        <h3>Update Class Description</h3>
        <textarea
          placeholder="New Class Description"
          value={updatedDescription}
          onChange={(e) => setUpdatedDescription(e.target.value)}
        />
        <button onClick={handleUpdateClassInfo}>Update Description</button>
      </div>

      {/* Delete Class */}
      <div>
        <h3>Delete Class</h3>
        <button onClick={handleDeleteClass}>Delete Class</button>
      </div>

      {/* Students */}
      <div>
        <h2>Students</h2>
        <ul>
          {classInfo.students?.length > 0 ? (
            classInfo.students.map((stu) => <li key={stu._id}>{stu.name}</li>)
          ) : (
            <p>No students found</p>
          )}
        </ul>
      </div>

      {/* Tests */}
      <div>
        <h2>Tests</h2>
        <ul>
          {classInfo.tests?.length > 0 ? (
            classInfo.tests.map((t) => (
              <li key={t._id}>
                {t.testName} - {t.subject}{" "}
                <button onClick={() => handleDeleteTest(t._id)}>Delete Test</button>
              </li>
            ))
          ) : (
            <p>No tests found</p>
          )}
        </ul>
      </div>
    </div>
  );
}