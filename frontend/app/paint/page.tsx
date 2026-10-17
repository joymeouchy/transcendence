
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import XPWindow from "../components/ui/XPWindow/XPWindow";

export default function PaintPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const timeout = setTimeout(() => setIsLoading(false), 2000);

  return () => clearTimeout(timeout);
}, []);

  return (
    <DesktopLayout>
      <XPWindow
        title="Paint"
        onClose={() => router.push("/home")}
        isLoading={isLoading}
        loadingMessage="Loading Paint..."
      >
        <div className="h-[65vh] max-h-162.5 min-h-100 w-full min-w-150 overflow-hidden bg-xp-gray-200">
          <iframe
            src="https://jspaint.app"
            title="JS Paint"
            className="block size-full min-h-100 min-w-75 border-none bg-xp-gray-200"
            allow="clipboard-read; clipboard-write"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </XPWindow>
    </DesktopLayout>
  );
}
