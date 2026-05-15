"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./page.module.scss";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // placeholders for testing
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h1 className="login-title">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <Link href="../register" className="register-link">
          Not a User? Register Now
        </Link>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}