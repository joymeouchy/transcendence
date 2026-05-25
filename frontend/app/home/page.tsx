//to run -> npm run dev
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "../../lib/socket";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "../components/Sidebar/Sidebar";
import "./page.scss"
import Taskbar from "../components/Taskbar/Taskbar";

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
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, []);

  return ( 
      <div className="xp-desktop">
       <Sidebar />
       <Taskbar />
      </div>
  );
}
