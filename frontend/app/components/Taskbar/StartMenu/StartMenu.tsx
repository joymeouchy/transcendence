"use client";

import "./StartMenu.scss";
import StartMenuColumn from "./StartMenuColumn";
import StartMenuItem from "./StartMenuItem/StartMenuItem";

import { images } from "@/lib/images";
import { tokenStorage } from "@/lib/token";

import { useRouter } from "next/navigation";

import {
  startMenuItemsLeft,
  startMenuItemsRight,
} from "@/app/data/navigationItems/startMenuItemsFields";

type StartMenuProps = {
  open: boolean;
};

export default function StartMenu({
  open,
}: StartMenuProps) {
  const router = useRouter();

  if (!open) return null;

  const handleSignOut = () => {
    const confirmed = window.confirm(
      "Are you sure you want to sign out?"
    );

    if (!confirmed) return;

    tokenStorage.remove();

    router.push("/login");
  };

  return (
    <div className="xp-start-menu">
      <div className="xp-start-menu-top">
        <img
          src="/defaultIcon.png"
          alt="User"
        />

        <span>j n</span>
      </div>

      <div className="xp-start-menu-body">
        <div className="xp-start-menu-left">
          <StartMenuColumn
            items={startMenuItemsLeft}
          />
        </div>

        <div className="xp-start-menu-right">
          <StartMenuColumn
            items={startMenuItemsRight}
          />
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
  );
}