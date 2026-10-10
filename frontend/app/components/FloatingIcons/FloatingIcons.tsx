
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./FloatingIcons.scss";

import DesktopIcon from "../Sidebar/DesktopIcon/DesktopIcon";
import { floatingIcons } from "@/app/data/navigationItems/FloatingIconsFields";
import DeepThoughtModal from "../deepThoughtModal/deepThoughtModal";
import MarvinModal from "../marvinModal/marvinModal";

export default function FloatingIcons() {
    const router = useRouter();

    const [deepThoughtOpen, setDeepThoughtOpen] = useState(false);
    const [marvinOpen, setMarvinOpen] = useState(false);

    return (
        <>
            <div className="floating-icons">
                {floatingIcons.map((icon) => (
                    <div
                        key={icon.label}
                        className={`floating-icon-position ${icon.position}`}
                    >
                        <DesktopIcon
                            image={icon.image}
                            label={icon.label}
                            onClick={() => {
                                if (icon.label === "Deep Thought") {
                                    setDeepThoughtOpen(true);
                                }

                                if (icon.label === "Marvin") {
                                    setMarvinOpen(true);
                                }

                                if (icon.label === "paint") {
                                    router.push("/paint");
                                }
                            }}
                        />
                    </div>
                ))}
            </div>

            <DeepThoughtModal
                isOpen={deepThoughtOpen}
                onClose={() => setDeepThoughtOpen(false)}
            />

            <MarvinModal
                isOpen={marvinOpen}
                onClose={() => setMarvinOpen(false)}
            />
        </>
    );
}
