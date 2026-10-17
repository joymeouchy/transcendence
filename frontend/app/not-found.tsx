"use client";

import { useRouter } from "next/navigation";
import "./globals.scss";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="not-found flex min-h-screen w-full items-center justify-center p-4 font-xp text-xp-text">
      <div className="w-110 max-w-[90vw] overflow-hidden rounded-xp-md bg-xp-blue p-0.5 shadow-xp-window">
        <div className="not-found__title-bar flex h-8 shrink-0 items-center justify-between px-xp-sm">
          <span className="not-found__title text-xp-md font-bold">System Error</span>
          <span>×</span>
        </div>

        <div className="not-found__content flex items-start gap-xp-md bg-xp-window-bg p-xp-lg text-xp-md max-[480px]:gap-xp-sm max-[480px]:p-xp-md">
          <div className="not-found__error-icon flex size-10.5 shrink-0 items-center justify-center rounded-xp-sm bg-xp-error text-[26px] font-bold text-xp-white">!</div>

          <div>
            <h1 className="mt-0 mb-xp-sm text-xp-xl font-bold text-xp-text">404 - Page Not Found</h1>
            <p className="mt-0 mb-xp-sm text-xp-md leading-normal text-xp-text">
              The page you're looking for doesn't exist
              or may have been moved.
            </p>
            <p className="mt-0 mb-xp-sm text-xp-md leading-normal text-xp-text">
              Check the address and try again.
            </p>
          </div>
        </div>

        <div className="not-found__actions flex justify-end gap-xp-sm bg-xp-window-bg p-xp-md">
          <button
            className="not-found__button min-w-22.5 cursor-pointer px-4 py-1.5 font-xp text-xp-base text-xp-gray-950 max-[480px]:min-w-0 max-[480px]:flex-1"
            onClick={() => router.replace("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    </main>
  );
}