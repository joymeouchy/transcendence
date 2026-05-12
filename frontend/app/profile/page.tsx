"use client";

import styles from "./page.module.scss";
import ProfileHeader from "../components/Profile/ProfileHeader/ProfileHeader";
import ProfileStats from "../components/Profile/ProfileStats/ProfileStats";

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

  return (
    <div className={styles.page}>
      <ProfileHeader
        username={user.username}
        tagline={user.tagline}
      />

      <ProfileStats
        wins={user.wins}
        losses={user.losses}
        winRate={winRate}
      />
    </div>
  );
}