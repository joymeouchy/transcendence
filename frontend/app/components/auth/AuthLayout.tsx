import React from "react";
import "./auth.scss";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="xp-screen relative h-screen w-screen overflow-hidden font-xp">
      <div className="absolute top-[45%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-10">
        <div className="text-right text-xp-lg leading-[1.2] text-xp-white">
          <div>
            42Beirut <br />
            <span className="text-xp-4xl font-bold">Pong XP</span>
          </div>
        </div>
        {children}
      </div>
      <div className="xp-bottom-bar absolute bottom-0 left-0 z-2 h-15 w-full" />
    </div>
  );
}
