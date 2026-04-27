
"use client";

import React, { useState } from "react";
// import type { FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const handleSubmit = (e : any) => {
  //   e.preventDefault();

  //   console.log("Email:", email);
  //   console.log("Password:", password);
  // };
  const handleSubmit = (e: any) => {
  e.preventDefault();
  console.log(email, password);
};
  return (
    <div className="flex items-center justify-center min-h-screen">
    <form  onSubmit={handleSubmit} className="flex flex-col gap-3 w-72 p-6 border rounded"
    >
      <h1 className="text-xl font-bold">Login Page</h1>
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
      <button type="submit"
      className="bg-black text-white p-2 rounded hover:opacity-80"
      >
        Login </button>      
    </form>
    </div>
  );
}