"use client";

import { useEffect, useState } from "react";

import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";

import { UserService, UserSearchResult } from "@/services/user.services";

import styles from "./FriendsPageTemplate.module.scss";

type Friend = {
  friendshipId: number;
  id: number;
  username: string;
  avatarUrl: string | null;
  isOnline: boolean;
};

type FriendRequest = {
  id: number;
  sender: {
    id: number;
    username: string;
    avatarUrl: string | null;
  };
};

interface Props {
  friends: Friend[];
  requests: FriendRequest[];

  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;

  onAddFriend?: (receiverId: number) => Promise<void>;

  onClose?: () => void;
}

export default function FriendsPageTemplate({
  friends,
  requests,
  onAccept,
  onReject,
  onAddFriend,
  onClose,
}: Props) {
  const [friendUsername, setFriendUsername] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<UserSearchResult | null>(null);


  useEffect(() => {
    async function searchUsers() {

      // Don't search if input is empty
      // or a user has already been selected
      if (!friendUsername.trim() || selectedUser) {
        setSearchResults([]);
        return;
      }


      try {
        const users = await UserService.search(friendUsername);

        setSearchResults(users);

      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
      }
    }


    searchUsers();

  }, [friendUsername, selectedUser]);



  async function handleAddFriend() {

    if (!selectedUser) {
      return;
    }


    try {

      await onAddFriend?.(selectedUser.id);


      setFriendUsername("");
      setSelectedUser(null);
      setSearchResults([]);


    } catch (err) {

      console.error(
        "Failed to send friend request:",
        err
      );

    }

  }



  return (
    <DesktopLayout>

      <XPWindow title="Friends" onClose={onClose}>

        <div className={styles.page}>


          {/* LEFT SIDE */}
          <div className={styles.leftColumn}>


            {/* ADD FRIEND */}
            <div className={styles.addFriend}>


              <div className={styles.searchBox}>

                <input
                  type="text"
                  placeholder="Search username..."
                  value={friendUsername}
                  onChange={(e) => {
                    setFriendUsername(e.target.value);
                    setSelectedUser(null);
                  }}
                />


                <button
                  onClick={handleAddFriend}
                  disabled={!selectedUser}
                >
                  Add
                </button>


              </div>



              {searchResults.length > 0 && (

                <div className={styles.searchResults}>

                  {searchResults.map((user) => (

                    <div
                      key={user.id}
                      className={styles.searchItem}
                      onClick={() => {

                        setSelectedUser(user);

                        setFriendUsername(
                          user.username
                        );

                        setSearchResults([]);

                      }}
                    >

                      <span
                        className={`${styles.dot} ${
                          user.isOnline
                            ? styles.online
                            : styles.offline
                        }`}
                      />


                      {user.username}


                    </div>

                  ))}


                </div>

              )}


            </div>




            {/* FRIEND REQUESTS */}
            <div className={styles.panel}>


              <div className={styles.title}>
                Friend Requests
              </div>



              <div className={styles.list}>


                {requests.length === 0 ? (

                  <div className={styles.empty}>
                    No requests
                  </div>


                ) : (


                  requests.map((request) => (

                    <div
                      key={request.id}
                      className={styles.friend}
                    >


                      <span>
                        {request.sender.username}
                      </span>



                      <div className={styles.actions}>


                        <button
                          onClick={() =>
                            onAccept?.(
                              request.id
                            )
                          }
                        >
                          Accept
                        </button>



                        <button
                          onClick={() =>
                            onReject?.(
                              request.id
                            )
                          }
                        >
                          Reject
                        </button>


                      </div>


                    </div>

                  ))

                )}


              </div>


            </div>


          </div>





          {/* RIGHT SIDE */}
          <div className={styles.friendsPanel}>


            <div className={styles.panel}>


              <div className={styles.title}>
                Friends
              </div>



              <div className={styles.list}>


                {friends.length === 0 ? (

                  <div className={styles.empty}>
                    No friends yet
                  </div>


                ) : (


                  friends.map((friend) => (

                    <div
                      key={friend.friendshipId}
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


          </div>



        </div>


      </XPWindow>


    </DesktopLayout>
  );
}