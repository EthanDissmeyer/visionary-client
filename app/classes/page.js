"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '../../utils/axios';

const ClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    throw new Error('UserId is missing. Please login again.');
                }

                const response = await axios.get('/classes', {
                    params: { userId },
                });

                setClasses(response.data.classes);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching classes:', error);
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const handleCreateClass = () => {
        router.push('/classes/create'); // Navigate to the Create Class page
    };

    const handleClassClick = (id) => {
        router.push(`/classes/${id}`); // Navigate to the Class Details page
    };

    return (
        <div>
            <h1>Classes</h1>
            {loading ? (
                <p>Loading classes...</p>
            ) : classes.length === 0 ? (
                <p>No classes found</p>
            ) : (
                <ul>
                    {classes.map((cls) => (
                        <li key={cls._id}>
                            <button onClick={() => handleClassClick(cls._id)}>
                                {cls.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={handleCreateClass}>Create New Class</button>
        </div>
    );
};

export default ClassesPage;
