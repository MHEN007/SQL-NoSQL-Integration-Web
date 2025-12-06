"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        // Handle login logic here
        const loginRequest = await fetch(`http://localhost:3001/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });

        if (loginRequest.ok) {
            // Redirect to home page or dashboard after successful login
            redirect('/products');
        } else {
            // Handle login error
            alert('Login failed. Please check your credentials and try again.');
        }
    }

    return (
        <div className="flex flex-col items-center bg-white text-black min-h-screen py-2">
            <div className="p-5">
                <h1 className="text-2xl font-bold">Login Form</h1>

                <div className="flex flex-col items-center mt-4">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 mb-2 rounded" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-4 rounded" />

                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}