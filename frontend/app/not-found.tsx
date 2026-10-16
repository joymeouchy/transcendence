"use client";

import { useRouter } from "next/navigation";
import "./not-found.scss";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="not-found">
      <div className="not-found__window">
        <div className="not-found__title-bar">
          <span>System Error</span>
          <span className="not-found__icon">×</span>
        </div>

        <div className="not-found__content">
          <div className="not-found__error-icon">!</div>

          <div className="not-found__message">
            <h1>404 - Page Not Found</h1>
            <p>
              The page you're looking for doesn't exist
              or may have been moved.
            </p>
            <p>
              Check the address and try again.
            </p>
          </div>
        </div>

        <div className="not-found__actions">
          <button onClick={() => router.replace("/")}>
            Go Home
          </button>
        </div>
      </div>
    </main>
  );
}