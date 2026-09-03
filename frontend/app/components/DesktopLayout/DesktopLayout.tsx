"use client";

import { ReactNode } from "react";

import Sidebar from "@/app/components/Sidebar/Sidebar";
import Taskbar from "@/app/components/Taskbar/Taskbar";
import FloatingIcons from "../FloatingIcons/FloatingIcons";

import { images } from "@/lib/images";

import "./DesktopLayout.scss";

type DesktopLayoutProps = {
  children: ReactNode;
};

export default function DesktopLayout({
  children,
}: DesktopLayoutProps) {
  return (
    <div
      className="xp-desktop"
      style={{
        backgroundImage: `url(${images.windowsOneCatWallpaper})`,
      }}
    >
      <Sidebar />

      <main className="xp-desktop-content">
        {children}
      </main>

      <FloatingIcons/>
      <Taskbar />
    </div>
  );
}