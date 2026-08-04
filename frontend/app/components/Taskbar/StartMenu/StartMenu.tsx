"use client";

import "./StartMenu.scss";
import StartMenuColumn from "./StartMenuColumn";
import StartMenuItem from "./StartMenuItem/StartMenuItem";

import { images } from "@/lib/images";
import { tokenStorage } from "@/lib/token";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import XPAlert from "../../ui/XPAlert/XPAlert";


import {
  startMenuItemsLeft,
  startMenuItemsRight,
} from "@/app/data/navigationItems/startMenuItemsFields";

type StartMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function StartMenu({
  open,
  onClose,
}: StartMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const handleSignOut = () => {
    setShowSignOutAlert(true);
  };

  const confirmSignOut = () => {
    tokenStorage.remove();
    router.push("/login");
  };

  return (
    <>
      {open && (
        <div
          className="xp-start-menu"
          ref={menuRef}
        >
          <div className="xp-start-menu-top">
            <img
              src="/defaultIcon.png"
              alt="User"
            />

            <span>j n</span>
          </div>

          <div className="xp-start-menu-body">
            <div className="xp-start-menu-left">
              <StartMenuColumn items={startMenuItemsLeft} />
            </div>

            <div className="xp-start-menu-right">
              <StartMenuColumn items={startMenuItemsRight} />
            </div>
          </div>

          <div className="xp-start-menu-bottom">
            <StartMenuItem
              image={images.shutdown}
              label="Sign out"
              onClick={handleSignOut}
              variant="danger"
            />
          </div>
        </div>
      )}

      <XPAlert
        isOpen={showSignOutAlert}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        onConfirm={confirmSignOut}
        onClose={() => setShowSignOutAlert(false)}
        showCancel
      />
    </>
  );
}