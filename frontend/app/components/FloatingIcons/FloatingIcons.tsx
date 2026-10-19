"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DesktopIcon from "../Sidebar/DesktopIcon/DesktopIcon";
import { floatingIcons } from "@/app/data/navigationItems/FloatingIconsFields";
import DeepThoughtModal from "../deepThoughtModal/deepThoughtModal";
import MarvinModal from "../marvinModal/marvinModal";
import DesktopCustomizationModal from "../DesktopCustomizationModal/DesktopCustomizationModal";

export default function FloatingIcons() {
  const router = useRouter();

  const [deepThoughtOpen, setDeepThoughtOpen] = useState(false);
  const [marvinOpen, setMarvinOpen] = useState(false);
  const [CustomizeOpen, setCustomizeOpen] = useState(false);

  return (
    <>
      {/* placed freely on larger screens (`roomy`); on phones (`compact`) they join the desktop icon grid */}
      <div className="pointer-events-none absolute inset-0 z-1 compact:contents">
        {floatingIcons.map((icon) => (
          <div
            key={icon.label}
            className={`pointer-events-auto roomy:absolute ${icon.position}`}
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

                if (icon.label === "Customize") {
                  setCustomizeOpen(true);
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

      <MarvinModal isOpen={marvinOpen} onClose={() => setMarvinOpen(false)} />
      <DesktopCustomizationModal isOpen={CustomizeOpen} onClose={() => setCustomizeOpen(false)} />
    </>
  );
}
