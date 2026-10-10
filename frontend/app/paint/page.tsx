
"use client";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import XPWindow from "../components/ui/XPWindow/XPWindow";
import { useRouter } from "next/navigation";

import styles from "./page.module.scss";

export default function PaintPage() {
    const router = useRouter();

    return (
        <DesktopLayout>
            
<XPWindow
    title="Paint"
    onClose={() => router.push("/home")}
    className="paint-window"
>
    <div className={styles.content}>
        <iframe
            src="https://jspaint.app"
            title="JS Paint"
            className={styles.iframe}
            allow="clipboard-read; clipboard-write"
        />
    </div>
</XPWindow>

        </DesktopLayout>
    );
}
