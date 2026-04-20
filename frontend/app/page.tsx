//to run -> npm run dev
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "../lib/socket";

export default function Home() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      socket.emit("ping");
    });

    socket.on("pong", (data) => {
      console.log("Server says:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("pong");
      socket.disconnect();
    };
  }, []);
  const router = useRouter();

  return( 
    //added simple nav bar that should be moved later to be able to be reused across all pages 
    <div> 
      <nav style={styles.navbar}>
        <h2>Pong Web App</h2>
        <nav style ={styles.navButtons}>
          <button onClick={()=>router.push("/")}> Home</button>
        </nav>
        <nav style ={styles.navButtons}>
          <button onClick={()=>router.push("/login")}> LogIn</button>
        </nav>
        <nav style ={styles.navButtons}>
          <button onClick={()=>router.push("/game")}> Game</button>
        </nav>
      </nav>
    </div>
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
    gap: "10px",
    backgroundColor: "#d8abab",
  },

  main: {
    padding: "20px",
  },
};