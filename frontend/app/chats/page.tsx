"use client";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import XPWindow from "../components/ui/XPWindow/XPWindow";

import { UserProfile } from "@/types/types.dto";

import "./page.module.scss";

interface ProfilePageTemplateProps {
  user: UserProfile;
  actions?: React.ReactNode;
  onClose?: () => void;
}

export default function chatsPage({
  user,
  actions,
  onClose,
}: ProfilePageTemplateProps) {

  return (
    <DesktopLayout>
      <XPWindow title="MSN" onClose={onClose}>
        <div className="hi"></div>
      </XPWindow>
    </DesktopLayout>
  );
}