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

      {/*
      <div className={styles.addBar}>
        <input
          className={styles.input}
          placeholder="Search username..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          className={styles.button}
          onClick={() => {
            if (results.length > 0) {
              sendRequest(results[0].id);
            }
          }}
          disabled={results.length === 0}
        >
          Add
        </button>
      </div>


      {results.length > 0 && (
        <div className={styles.searchResults}>
          {results.map((user) => (
            <div
              key={user.id}
              className={styles.searchItem}
              onClick={() => sendRequest(user.id)}
            >
              <span
                className={`${styles.dot} ${
                  user.isOnline ? styles.offline : styles.online
                }`}
              />

              {user.username}
            </div>
          ))}
        </div>
      )}
      */}


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
                    ? styles.offline
                    : styles.online
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