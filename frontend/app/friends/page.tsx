"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FriendsPageTemplate from "../components/Friends/FriendsPageTemplate/FriendsPageTemplate";

import { UserService } from "@/services/user.services";
import { FriendshipService } from "@/services/friendships.service";

import {
  Friend,
  PendingRequest,
} from "@/services/friendships.service";


export default function FriendsPage() {
  const router = useRouter();


  const [userId, setUserId] = useState<number | null>(null);

  const [friends, setFriends] = useState<Friend[]>([]);

  const [requests, setRequests] = useState<PendingRequest[]>([]);



  useEffect(() => {

    async function loadPage() {

      try {

        const user = await UserService.getMe();


        setUserId(user.id);



        const [
          friendsData,
          requestsData,
        ] = await Promise.all([

          FriendshipService.getFriends(
            user.id
          ),

          FriendshipService.getPendingRequests(
            user.id
          ),

        ]);



        setFriends(friendsData);

        setRequests(requestsData);



      } catch (error) {

        console.error(
          "Failed to load friends:",
          error
        );

      }

    }



    loadPage();


  }, []);





  async function refreshFriends() {

    if (userId === null) return;



    try {

      const [
        friendsData,
        requestsData,
      ] = await Promise.all([

        FriendshipService.getFriends(
          userId
        ),

        FriendshipService.getPendingRequests(
          userId
        ),

      ]);



      setFriends(friendsData);

      setRequests(requestsData);
    } catch (error) {

      console.error(
        "Failed to refresh friends:",
        error
      );

    }

  }






  async function handleAccept(id: number) {

    try {

      await FriendshipService.acceptRequest(id);


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

      await FriendshipService.rejectRequest(id);



      setRequests((prev) =>
        prev.filter(
          (request) =>
            request.id !== id
        )
      );



    } catch (error) {

      console.error(
        "Failed to reject request:",
        error
      );

    }

  }







  async function handleRemoveFriend(
    friendshipId: number
  ) {

    try {

      await FriendshipService.rejectRequest(
        friendshipId
      );



      setFriends((prev) =>
        prev.filter(
          (friend) =>
            friend.friendshipId !== friendshipId
        )
      );



    } catch (error) {

      console.error(
        "Failed to remove friend:",
        error
      );

    }

  }







  async function handleAddFriend(
    receiverId: number
  ) {

    if (userId === null) return;



    try {

      await FriendshipService.sendRequest(
        userId,
        receiverId
      );



      await refreshFriends();



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
      onRemoveFriend={handleRemoveFriend}
      onAddFriend={handleAddFriend}
      onClose={() =>
        router.push("/home")
      }
    />
  );
}