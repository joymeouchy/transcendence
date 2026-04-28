"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Navbar () {
	const router = useRouter();
	return ( 
	<nav style={styles.navbar}>
        <h2>Pong Web App</h2>

	<div style ={styles.navButtons}>
		<Link href="/"> Home</Link>
		<Link href="/login"> LogIn</Link>
		<Link href="/game"> Game</Link>
		<Link href="/profile"> profile</Link>
    </div>
	</nav>
  );

}


const styles: Record<string, React.CSSProperties> = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#111",
    color: "white",
  },

  navButtons: {
    display: "flex",
    gap: "100px",
  },

  main: {
    padding: "20px",
  },
};