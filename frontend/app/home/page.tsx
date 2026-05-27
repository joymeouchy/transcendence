"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "../../lib/socket";
import { isAuthenticated } from "@/lib/auth";

import Sidebar from "../components/Sidebar/Sidebar";
import Taskbar from "../components/Taskbar/Taskbar";

import { images } from "@/lib/images";
import "./page.scss";

export default function Home() {
  const router = useRouter();

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

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div
      className="xp-desktop"
      style={{
        backgroundImage: `url(${images.windowsDefaultWallpaper})`,
      }}
    >
      <Sidebar />
      <Taskbar />
    </div>
  );
}