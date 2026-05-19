"use client";

import Link from "next/link";
import { useState } from "react";
import "./page.scss";

// import "./page"

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // placeholders for testing
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirmed Password:", confirmPassword);
  };

const labels = [
    {
      name: "Username",
      placeholder: "Username",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setUsername(e.target.value),
      value: username,
      required: true,
      type: "text",
    },
    {
      name: "Email",
      placeholder: "example@example.com",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setEmail(e.target.value),
      value: email,
      required: true,
      type: "email",
    },
    {
      name: "Password",
      placeholder: "Password",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value),
      value: password,
      required: true,
      type: "password",
    },
    {
      name: "Confirm Password",
      placeholder: "Password",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setConfirmPassword(e.target.value),
      value: confirmPassword,
      required: true,
      type: "password",
    },
  ];


  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <h1 className="register-title">Register</h1>
          {labels.map((label) => (
              <div key={label.name}>
                <label className="register-label">{label.name}</label>
                <input
                  type={label.type}
                  placeholder={label.placeholder}
                  value={label.value}
                  onChange={label.onChange}
                  className="register-input"
                  required={label.required}
                />
              </div>
            ))}
        <Link href="../login" className="login-link">
          Already a User? Login
        </Link>

        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
}