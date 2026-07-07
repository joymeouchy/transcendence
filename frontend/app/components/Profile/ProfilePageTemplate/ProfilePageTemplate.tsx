"use client";

import ProfileHeader from "../ProfileHeader/ProfileHeader";
import ProfileStats from "../ProfileStats/ProfileStats";
import FriendsPanel from "../FriendsPanel/FriendsPanel";
import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";

import { UserProfileFields } from "@/app/data/profile/profile";

import styles from "./ProfilePageTemplate.module.scss";

interface ProfilePageTemplateProps {
  user: UserProfileFields;
  actions?: React.ReactNode;
  onClose?: () => void;
}

export default function ProfilePageTemplate({
  user,
  actions,
  onClose,
}: ProfilePageTemplateProps) {
  const winRate =
    user.wins + user.losses > 0
      ? Math.round((user.wins / (user.wins + user.losses)) * 100)
      : 0;

  return (
    <DesktopLayout>
      <XPWindow title="User Profile" onClose={onClose}>
        <div className={styles.page}>

          {/* LEFT */}
          <aside className={styles.leftPanel}>
            <ProfileHeader
              username={user.username}
              tagline={user.tagline}
            />

            {actions && (
              <div className={styles.groupBox}>
                <div className={styles.groupTitle}>Actions</div>
                {actions}
              </div>
            )}

            <div className={styles.groupBox}>
              <div className={styles.groupTitle}>Status</div>
              <div className={styles.status}>
                {user.isOnline ? "🟢 Online" : "⚫ Offline"}
              </div>
            </div>
          </aside>

          {/* RIGHT */}
          <section className={styles.rightPanel}>

            <div className={styles.topRow}>

              <div className={styles.groupBox}>
                <div className={styles.groupTitle}>
                  Game Statistics
                </div>

                <ProfileStats
                  wins={user.wins}
                  losses={user.losses}
                  winRate={winRate}
                />
              </div>

              <div className={styles.groupBox}>
                <div className={styles.groupTitle}>
                  Account Info
                </div>

                <div className={styles.infoGrid}>
                  <div>Username: {user.username}</div>
                  <div>Rank: {user.rank}</div>
                  <div>Mode: {user.mode}</div>
                  <div>Member since: {user.memberSince}</div>
                </div>
              </div>

            </div>

            <div className={styles.groupBox}>
              <div className={styles.groupTitle}>Friends</div>
              <FriendsPanel />
            </div>

          </section>

        </div>
      </XPWindow>
    </DesktopLayout>
  );
}