"use client";

import ProfilePageTemplate from "../components/Profile/ProfilePageTemplate/ProfilePageTemplate";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const user = {
    username: "Player1",
    tagline: "Pong Competitor",
    wins: 1,
    losses: 2,
    isOnline: true,
    rank: "Beginner",
    mode: "Classic Pong",
    memberSince: "2026",
  };

  return (
    <ProfilePageTemplate
      user={user}
      onClose={() => router.push("/home")}
      actions={
        <ul>
          <li>Edit profile</li>
          <li>Change password</li>
        </ul>
      }
    />
  );
}