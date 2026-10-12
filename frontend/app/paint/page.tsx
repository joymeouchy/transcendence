
"use client";

import { useState, useEffect } from "react";
import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import XPWindow from "../components/ui/XPWindow/XPWindow";
import { useRouter } from "next/navigation";

import styles from "./page.module.scss";

export default function PaintPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <DesktopLayout>
      <XPWindow
        title="Paint"
        onClose={() => router.push("/home")}
        className="paint-window"
        isLoading={isLoading}
        loadingMessage="Loading Paint..."
      >
        <div className={styles.content}>
          <iframe
            src="https://jspaint.app"
            title="JS Paint"
            className={styles.iframe}
            allow="clipboard-read; clipboard-write"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </XPWindow>
    </DesktopLayout>
  );
}
