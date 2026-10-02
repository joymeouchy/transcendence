import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.scss";
import "./styles/xp-theme.scss"

import { AuthProvider } from "@/context/AuthContext";
import { GameInviteProvider } from "@/context/GameInviteContext";
import GameInvitePopup from "./components/GameInvitePopup/GameInvitePopup";
import { AlertProvider } from "@/context/AlertContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pong XP",
  description: "Created by jmeouchy and rdennaou",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        {<AuthProvider>
          <AlertProvider>
            <GameInviteProvider>
              {children}
              <GameInvitePopup />
            </GameInviteProvider>
          </AlertProvider>
        </AuthProvider>}
      </body>
    </html>
  );
}