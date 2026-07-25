"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FriendsPageTemplate from "../components/Friends/FriendsPageTemplate/FriendsPageTemplate";

import {
  getFriends,
  getPendingRequests,
  acceptFriendRequest,
  removeFriendship,
  sendFriendRequest,
  Friend,
  PendingRequest,
} from "@/services/friendships.service";

export default function FriendsPage() {
  const router = useRouter();

  const userId = 1; // temporary until auth user id exists

  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<PendingRequest[]>([]);

  useEffect(() => {
    async function loadFriends() {
      try {
        const friendsData = await getFriends(userId);
        const requestsData = await getPendingRequests(userId);

        setFriends(friendsData);
        setRequests(requestsData);
      } catch (error) {
        console.error("Failed to load friends:", error);
      }
    }

    loadFriends();
  }, []);


  async function refreshFriends() {
    try {
      const friendsData = await getFriends(userId);
      const requestsData = await getPendingRequests(userId);

      setFriends(friendsData);
      setRequests(requestsData);
    } catch (error) {
      console.error("Failed to refresh friends:", error);
    }
  }


  async function handleAccept(id: number) {
    try {
      await acceptFriendRequest(id);

      await refreshFriends();

    } catch (error) {
      console.error(
        "Failed to accept request:",
        error
      );
    }
  }


  async function handleReject(id: number) {
    try {
      await removeFriendship(id);

      setRequests((prev) =>
        prev.filter(
          (request) => request.id !== id
        )
      );

    } catch (error) {
      console.error(
        "Failed to reject request:",
        error
      );
    }
  }


  async function handleAddFriend(receiverId: number) {
    try {
      await sendFriendRequest(
        userId,
        receiverId
      );

      alert("Friend request sent");

    } catch (error) {
      console.error(
        "Failed to send friend request:",
        error
      );
    }
  }


  return (
    <FriendsPageTemplate
      friends={friends}
      requests={requests}
      onAccept={handleAccept}
      onReject={handleReject}
      onAddFriend={handleAddFriend}
      onClose={() => router.push("/home")}
    />
  );
}