"use client";

import { useEffect, useState } from "react";

import styles from "./FriendsPanel.module.scss";

import { FriendshipService, Friend } from "@/services/friendships.service";

type Props = {
  userId: number;
};

export default function FriendsPanel({ userId }: Props) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFriends() {
    try {
      const data = await FriendshipService.getFriends(userId);
      setFriends(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFriends();
  }, [userId]);


  return (
    <div className={styles.groupBox}>

      <div className={styles.list}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className={styles.friend}
            >
              <span
                className={`${styles.dot} ${
                  friend.isOnline
                    ? styles.online
                    : styles.offline
                }`}
              />

              {friend.username}
            </div>
          ))
        )}
      </div>

    </div>
  );
}