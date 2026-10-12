"use client";

import ProfilePageTemplate from "../components/Profile/ProfilePageTemplate/ProfilePageTemplate";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { Friend, FriendshipService } from "@/services/friendships.service";

export default function ProfilePage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    async function loadFriends() {
      if (loading) return;

      if (!user) {
        setFriends([]);
        setLoadingFriends(false);
        return;
      }

      setLoadingFriends(true);

      try {
        const data = await FriendshipService.getFriends(user.id);
        setFriends(data);
      } catch (error) {
        console.error("Failed to load friends:", error);
      } finally {
        setLoadingFriends(false);
      }
    }

    loadFriends();
  }, [user, loading]);

  return (
    <ProfilePageTemplate
      user={user ?? undefined}
      friends={friends}
      loadingProfile={loading}
      loadingFriends={loadingFriends}
      isOwnProfile={true}
      onClose={() => router.push("/home")}
    />
  );
}
