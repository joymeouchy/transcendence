"use client";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import XPWindow from "../components/ui/XPWindow/XPWindow";

import { UserProfileFields } from "@/app/data/profile/profile";

import "./page.module.scss";

interface ProfilePageTemplateProps {
  user: UserProfileFields;
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