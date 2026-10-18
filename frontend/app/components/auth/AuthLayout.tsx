
import React from "react";
import "./auth.scss";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="xp-screen relative min-h-screen w-full overflow-x-hidden font-xp">
      <div
        className="
          absolute left-1/2 top-[45%]
          flex w-full max-w-5xl -translate-x-1/2 -translate-y-1/2
          flex-col items-center gap-8 px-6
md:top-1/2 md:flex-row md:justify-center md:gap-10
        "
      >
        <div className="text-center text-xp-lg leading-[1.2] text-xp-white sm:text-right">
          <div>
            42Beirut <br />
            <span className="text-xp-4xl font-bold">Pong XP</span>
          </div>
        </div>

        <div className="w-full min-w-0 max-w-md sm:w-auto">
          {children}
        </div>
      </div>

      <div className="xp-bottom-bar absolute bottom-0 left-0 z-2 h-15 w-full" />
    </div>
  );
}
