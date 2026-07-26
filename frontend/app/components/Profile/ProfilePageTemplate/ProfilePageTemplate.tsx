"use client";

import ProfileHeader from "../ProfileHeader/ProfileHeader";
import ProfileStats from "../ProfileStats/ProfileStats";
import FriendsPanel from "../FriendsPanel/FriendsPanel";
import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";

import { UserProfile } from "@/types/types.dto";

import styles from "./ProfilePageTemplate.module.scss";

interface ProfilePageTemplateProps {
  user?: UserProfile;
  actions?: React.ReactNode;
  onClose?: () => void;
}

export default function ProfilePageTemplate({
  user,
  actions,
  onClose,
}: ProfilePageTemplateProps) {


  if (!user) {
    return (
      <DesktopLayout>
        <XPWindow title="User Profile" onClose={onClose}>
          <div className={styles.loading}>
            Loading user profile...
          </div>
        </XPWindow>
      </DesktopLayout>
    );
  }


  return (
    <DesktopLayout>
      <XPWindow title="User Profile" onClose={onClose}>
        <div className={styles.page}>

          {/* LEFT */}
          <aside className={styles.leftPanel}>

            <ProfileHeader
              username={user.username}
              avatarUrl={user.avatarUrl}
            />


            {actions && (
              <div className={styles.groupBox}>
                <div className={styles.groupTitle}>
                  Actions
                </div>

                {actions}
              </div>
            )}


            <div className={styles.groupBox}>
              <div className={styles.groupTitle}>
                Status
              </div>

              <div className={styles.status}>
                {user.isOnline
                  ? "🟢 Online"
                  : "⚫ Offline"}
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
                  winRate={user.winRate}
                />

              </div>



              <div className={styles.groupBox}>

                <div className={styles.groupTitle}>
                  Account Info
                </div>


                <div className={styles.infoGrid}>

                  <div>
                    Username: {user.username}
                  </div>

                  <div>
                    Email: {user.email}
                  </div>

                  <div>
                    Provider: {user.provider}
                  </div>

                  <div>
                    Total Matches: {user.totalMatches}
                  </div>

                </div>

              </div>


            </div>




            <div className={styles.groupBox}>

              <div className={styles.groupTitle}>
                Friends
              </div>

              <FriendsPanel userId={user.id} />

            </div>



          </section>

        </div>
      </XPWindow>
    </DesktopLayout>
  );
}