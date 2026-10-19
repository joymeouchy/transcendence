"use client";

import ProfilePageTemplate from "@/app/components/Profile/ProfilePageTemplate/ProfilePageTemplate";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserService } from "@/services/user.services";
import { Friend, FriendshipService } from "@/services/friendships.service";
import { useAuth } from "@/context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { UserProfile } from "@/types/types.dto";

export default function UserProfilePage() {
  const params = useParams();

  const router = useRouter();

  const { user: currentUser } = useAuth();
  const { showAlert } = useAlert();

  const [user, setUser] = useState<UserProfile | null>(null);

  const [friends, setFriends] = useState<Friend[]>([]);

  const [isFriend, setIsFriend] = useState(false);

  const [friendshipId, setFriendshipId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      // forget the previous profile's friendship, or a stranger's profile
      // opened after a friend's would offer "Remove Friend" on the old id
      setIsFriend(false);
      setFriendshipId(null);

      try {
        const id = Number(params.id);
        const [profile, profileFriends] = await Promise.all([
          UserService.getById(id),
          FriendshipService.getFriends(id),
        ]);
        setUser(profile);
        setFriends(profileFriends);
        if (currentUser && currentUser.id !== id) {
          const myFriends = await FriendshipService.getFriends(currentUser.id);

          const friendship = myFriends.find((friend) => friend.id === id);
          if (friendship) {
            setIsFriend(true);
            setFriendshipId(friendship.friendshipId);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
        setLoadingFriends(false);
      }
    }
    if (params.id) {
      loadProfile();
    }
  }, [params.id, currentUser]);

  async function handleAddFriend() {
    if (!currentUser || !user) return;

    try {
      await FriendshipService.sendRequest(currentUser.id, user.id);
      showAlert(`Friend request sent to ${user.username}.`);
    } catch (error) {
      // the api layer already shows the error popup
    }
  }

  async function handleRemoveFriend() {
    if (!friendshipId) return;

    try {
      await FriendshipService.rejectRequest(friendshipId);
      setIsFriend(false);
      setFriendshipId(null);
    } catch (error) {
    }
  }

  const isOwnProfile = currentUser?.id === user?.id;
  return (
    <ProfilePageTemplate
      user={user ?? undefined}
      friends={friends}
      loadingFriends={loadingFriends}
      loadingProfile={loading}
      isOwnProfile={isOwnProfile}
      isFriend={isFriend}
      onAddFriend={handleAddFriend}
      onRemoveFriend={handleRemoveFriend}
      onClose={() => router.push("/home")}
    />
  );
}
