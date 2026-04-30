"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    console.log("Login successful:", data);
    // router.push("/home");  // go to home or profile when login successful

  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen">
    <form  onSubmit={handleSubmit} className="flex flex-col gap-3 w-72 p-6 border rounded"
    >
      <h1 className="text-xl font-bold">Login</h1>
      <input
      type = "email"
      placeholder = "Email"
      value={email}
      onChange = {(e) => setEmail(e.target.value)}
      className="border p-2 rounded w-64"/>
      <input
      type = "password"
      placeholder = "Password"
      value={password}
      onChange = {(e) => setPassword(e.target.value)}
      className="border p-2 rounded w-64"
      />
      <Link href="../register" className="text-blue-500 hover:underline">
        Not a User? Register Now
      </Link>
      <button type="submit"
      className="bg-black text-white p-2 rounded hover:opacity-80"
      >
        Login </button>
    </form>
    </div>
  );
}