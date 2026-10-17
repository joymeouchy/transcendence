// components/GoogleAuthError/GoogleAuthError.tsx
"use client";

import { useSearchParams } from "next/navigation";
import styles from "./GoogleAuthError.module.scss";

// A Map, not a plain object: ?error=constructor must not hit Object.prototype
const MESSAGES = new Map<string, string>([
  ["google_email_exists", "This email is already registered. Please log in with your password."],
  ["google_failed", "Google sign in failed. Please try again."],
]);
const FALLBACK = MESSAGES.get("google_failed")!;

export default function GoogleAuthError() {
  const code = useSearchParams().get("error");

  if (!code) return null;

  return (
    <div
      role="alert"
      className={`${styles.box} mb-xp-md flex items-start gap-xp-sm rounded-xp-sm p-xp-sm font-xp text-xp-base text-xp-error-dark`}
    >
      <span
        aria-hidden="true"
        className={`${styles.icon} grid size-5 shrink-0 place-items-center rounded-xp-2xs text-xp-xs font-bold`}
      >
        !
      </span>
      <p className="m-0">{MESSAGES.get(code) ?? FALLBACK}</p>
    </div>
  );
}