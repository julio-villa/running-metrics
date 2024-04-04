import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

const ProgressLogging = ({ user , onRunAdded}) => {
    const [run, setRun] = useState({
        date: '',
        time: '',
        distance: '',
        duration: '',
        pace: '',
        type: 'Easy',
        effort: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRun(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedRun = {
            ...run,
            pace: Number(run.pace),
            effort: Number(run.effort),
            duration: Number(run.duration),
            distance: Number(run.distance)
        };

        if (user) {
            try {
                const response = await fetch(`https://6z4n2v4wg6.execute-api.us-east-2.amazonaws.com/test_1/users/${user.uid}/runs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ run: formattedRun })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    setMessage("Run added successfully!");
                    // Fetch new data and cause graph to update
                    onRunAdded && onRunAdded(); 
                } else {
                    throw new Error(result.error || "An error occurred");
                }

                // Reset form fields
                setRun({
                    date: '',
                    time: '',
                    distance: '',
                    duration: '',
                    pace: '',
                    type: 'Easy',
                    effort: ''
                });

            } catch (error) {
                console.error("Error adding run:", error);
                setMessage("Failed to add run.");
            }
        }
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!user) {
        return <Navigate to="/" />;
    }

    // // Display any success or error message after submitting the form
    // if (updateResult?.success) {
    //     console.log("Run added successfully");
    // }
    // if (updateResult?.error) {
    //     console.error("Error updating runs:", updateResult.error);
    // }
    return (
        <div>
            <h2>Input a run here:</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="date" value={run.date} onChange={handleChange} placeholder="Date (MM/DD/YYYY)" />
                <input type="text" name="time" value={run.time} onChange={handleChange} placeholder="Time (HH:MM)" />
                <input type="number" name="distance" value={run.distance} onChange={handleChange} placeholder="Distance (miles)" />
                <input type="number" name="duration" value={run.duration} onChange={handleChange} placeholder="Duration (minutes)" />
                <input type="number" name="pace" value={run.pace} onChange={handleChange} placeholder="Pace (minutes per mile)" />
                <select name="type" value={run.type} onChange={handleChange}>
                    <option value="easy">Easy</option>
                    <option value="recovery">Recovery</option>
                    <option value="long">Long</option>
                    <option value="tempo">Tempo</option>
                </select>
                <input type="number" name="effort" value={run.effort} onChange={handleChange} placeholder="Effort (RPE 1-10)" />
                <button type="submit">Add Run</button>
            </form>
            <br></br>
            {message && <p>{message}</p> ? <p>{message}</p> : null}
        </div>
    );
};

export default ProgressLogging;
