"use client";

export default function GamePage() {
  return (
    <div>
      <h1>Game Page</h1>

      <button onClick={() => console.log("looking for new match clicked")}>
        Look for a new match
      </button>
    </div>
  );
}

