"use client";

import { useEffect, useState } from "react";

import styles from "./FriendsPanel.module.scss";

import { UserService, UserSearchResult } from "@/services/user.services";
import { FriendshipService, Friend } from "@/services/friendships.service";

type Props = {
  userId: number;
};

export default function FriendsPanel({ userId }: Props) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [input, setInput] = useState("");

  const [results, setResults] = useState<UserSearchResult[]>([]);
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

  useEffect(() => {
    async function search() {
      if (!input.trim()) {
        setResults([]);
        return;
      }

      try {
        const users = await UserService.search(input);

        // Don't show yourself
        setResults(users.filter((u) => u.id !== userId));
      } catch (err) {
        console.error(err);
      }
    }

    search();
  }, [input, userId]);

  async function sendRequest(receiverId: number) {
    try {
      await FriendshipService.sendRequest(userId, receiverId);

      setInput("");
      setResults([]);

      // Optional: reload friends if your backend immediately returns accepted friendships
      await loadFriends();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.groupBox}>
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
                  user.isOnline ? styles.online : styles.offline
                }`}
              />

              {user.username}
            </div>
          ))}
        </div>
      )}

      <div className={styles.list}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          friends.map((friend) => (
            <div key={friend.id} className={styles.friend}>
              <span
                className={`${styles.dot} ${
                  friend.isOnline ? styles.online : styles.offline
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