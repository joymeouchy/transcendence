"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProfilePageTemplate from "../components/Profile/ProfilePageTemplate/ProfilePageTemplate";
import { UserService } from "@/services/user.services";
import { UserProfile } from "@/types/types.dto";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile>();

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await UserService.getMe();

        setUser(data);

      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );
      }
    }


    loadUser();

  }, []);


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