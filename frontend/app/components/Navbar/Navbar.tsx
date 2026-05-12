
"use client";

import Link from "next/link";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h2 className={styles.title}>Pong Web App</h2>

      <div className={styles.navButtons}>
        <Link href="/">Home</Link>
        <Link href="/login">LogIn</Link>
        <Link href="/game">Game</Link>
        <Link href="/profile">Profile</Link>
      </div>
    </nav>
  );
}
