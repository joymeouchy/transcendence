"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./auth.scss";

type AuthLayoutProps = {
  children: React.ReactNode;
  // drop the branding column and center the children (legal pages)
  fullWidth?: boolean;
};

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
];

export default function AuthLayout({ children, fullWidth = false }: AuthLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="xp-screen relative h-dvh w-full overflow-hidden font-xp">
      <main className="absolute inset-x-0 top-15 bottom-15 overflow-y-auto">
        {fullWidth ? (
          <div className="flex min-h-full items-center justify-center p-xp-lg">{children}</div>
        ) : (
        /* The branding stays put whatever the form's size: on phones it starts
            at a fixed spot near the top with the form right below it; on wider
            screens branding | divider | a fixed-width form column are centered as one row. */
        <div
          className="
            mx-auto flex min-h-full w-full max-w-5xl
            flex-col items-center gap-xp-xl px-6 pt-[max(1.5rem,6dvh)] pb-xp-xl
md:flex-row md:justify-center md:gap-10 md:py-xp-xl
          "
        >
<div className="w-full shrink-0 text-center text-xp-lg leading-[1.2] text-xp-white md:w-auto">          <div>
              42Beirut <br />
              <span className="text-xp-4xl font-bold">Pong XP</span>
            </div>
          </div>

          <div className="xp-divider hidden h-[60vh] w-px shrink-0 opacity-90 md:block" />

          {/* same width on every auth page (login panel and welcome tiles are
              both 360px), so the centered row never shifts */}
          <div className="flex w-full min-w-0 max-w-md justify-center md:w-90 md:max-w-none md:justify-start">{children}</div>
        </div>
        )}
      </main>

      <footer className="xp-bottom-bar absolute bottom-0 left-0 z-2 flex h-15 w-full items-center justify-center px-6 md:justify-end">
        <nav aria-label="Legal">
          <ul className="m-0 flex list-none gap-xp-lg p-0">
            {legalLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  prefetch={false}
                  aria-current={pathname === href ? "page" : undefined}
                  className="xp-footer-link text-xp-md text-xp-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </footer>
    </div>
  );
}
