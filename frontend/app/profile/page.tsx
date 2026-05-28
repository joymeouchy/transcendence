"use client";

import XPWindow from "../components/ui/XPWindow/XPWindow";
import ProfileHeader from "../components/Profile/ProfileHeader/ProfileHeader";
import ProfileStats from "../components/Profile/ProfileStats/ProfileStats";
import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import FriendsPanel from "../components/Profile/FriendsPanel/FriendsPanel";

import { useRouter } from "next/navigation";

import styles from "./page.module.scss";

export default function UserProfile() {
  const user = {
    username: "Player1",
    tagline: "Pong Competitor",
    wins: 1,
    losses: 2,
  };

  const winRate = Math.round(
    (user.wins / (user.wins + user.losses)) * 100
  );
  const router = useRouter();

  return (
    <DesktopLayout>
      <XPWindow title="User Accounts - Control Panel"
      onClose={() => router.push("/home")}
      >

        <div className={styles.page}>

          {/* LEFT PANEL */}
          <aside className={styles.leftPanel}>
            <ProfileHeader
              username={user.username}
              tagline={user.tagline}
            />

            <div className={styles.groupBox}>
              <div className={styles.groupTitle}>Account Tasks</div>
              <ul className={styles.links}>
                <li>Edit profile</li>
                <li>Change password</li>
              </ul>
            </div>

            <div className={styles.groupBox}>
              <div className={styles.groupTitle}>Status</div>
              <div className={styles.status}>
                🟢 Online
              </div>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className={styles.rightPanel}>

            {/* TOP ROW: Stats + Info */}
            <div className={styles.topRow}>

              <div className={styles.groupBox}>
                <div className={styles.groupTitle}>Game Statistics</div>

                <ProfileStats
                  wins={user.wins}
                  losses={user.losses}
                  winRate={winRate}
                />
              </div>

              <div className={styles.groupBox}>
                <div className={styles.groupTitle}>Account Information</div>

                <div className={styles.infoGrid}>
                  <div>Username: {user.username}</div>
                  <div>Rank: Beginner</div>
                  <div>Mode: Classic Pong</div>
                  <div>Member since: 2026</div>
                </div>
              </div>

            </div>

            {/* BOTTOM: Friends takes full width */}
            <div className={styles.friendsSection}>
              <div className={styles.groupBox}>
                <div className={styles.groupTitle}>Friends</div>
                <FriendsPanel />
              </div>
            </div>

          </section>

        </div>

      </XPWindow>
    </DesktopLayout>
  );
}