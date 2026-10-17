"use client";

import "./StartMenu.scss";
import StartMenuColumn from "./StartMenuColumn";
import StartMenuItem from "./StartMenuItem/StartMenuItem";

import { images } from "@/lib/images";
import { useAuth } from "@/context/AuthContext";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { playSound, sounds } from "@/lib/sounds";

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
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const [showSignOutAlert, setShowSignOutAlert] = useState(false);

  const handleSignOut = () => {
    setShowSignOutAlert(true);
  };

  const confirmSignOut = () => {
    playSound(sounds.shutdown);
    // logout clears the token and the user, which disconnects the socket so others see us offline
    logout();
    router.push("/login");
  };

  return (
    <>
      {open && (
        <div
          className="xp-start-menu fixed bottom-10 left-2.5 z-1000 flex h-80 w-70 flex-col overflow-hidden rounded-xp-sm bg-xp-window-bg p-0 font-xp text-xp-md text-xp-text shadow-xp-window"
          ref={menuRef}
        >
          <div className="xp-start-menu-top flex min-h-10 w-full items-center gap-2 px-2.5 py-2 text-xp-white">
          </div>

          <div className="flex h-full w-full flex-1 flex-row overflow-hidden">
            <div className="xp-start-menu-left flex min-w-0 flex-1 flex-col gap-1.5 p-2.5">
              <StartMenuColumn items={startMenuItemsLeft} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2.5">
              <StartMenuColumn items={startMenuItemsRight} />
            </div>
          </div>

          <div className="xp-start-menu-bottom flex w-full justify-end p-2">
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