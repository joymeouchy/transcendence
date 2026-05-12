//to run -> npm run dev
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "../lib/socket";
import Navbar from "./components/Navbar/Navbar";

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
      <Navbar ></Navbar>
    </div>
  );
}
