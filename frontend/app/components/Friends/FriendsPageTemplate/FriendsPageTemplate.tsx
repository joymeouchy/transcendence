"use client";

import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";

import AddFriendPanel from "../AddFriendsPanel/AddFriendsPanel";
import FriendRequestsPanel from "../FriendRequestPanel/FriendRequestPanel";
import FriendsListPanel from "../FriendListPanel/FriendListPanel";

import { FriendRequest, Friend } from "@/types/types.dto";

interface Props {
  friends: Friend[];
  requests: FriendRequest[];

  loading?: boolean;

  onAccept?: (id: number) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
  onRemoveFriend?: (id: number) => Promise<void>;
  onSelectFriend?: (friend: Friend) => void;

  onAddFriend?: (receiverId: number) => Promise<void>;

  onClose?: () => void;
}

export default function FriendsPageTemplate({
  friends,
  requests,
  loading = false,
  onAccept,
  onReject,
  onRemoveFriend,
  onSelectFriend,
  onAddFriend,
  onClose,
}: Props) {
  return (
    <DesktopLayout>
      <XPWindow
        title="Friends"
        onClose={onClose}
        isLoading={loading}
        loadingMessage="Loading friends list..."
      >
        <div className="flex size-full min-h-75 max-w-150 min-w-0 gap-xp-md max-[700px]:max-w-full max-[700px]:flex-col max-[450px]:gap-xp-sm">
          <div className="flex w-60 min-w-0 shrink-0 flex-col gap-xp-md max-[700px]:w-full max-[450px]:gap-xp-sm">
            <AddFriendPanel onAddFriend={onAddFriend} />

            <FriendRequestsPanel
              requests={requests}
              onAccept={onAccept}
              onReject={onReject}
            />
          </div>

          <div className="flex min-w-0 flex-1 max-[700px]:w-full">
            <FriendsListPanel
              friends={friends}
              onRemoveFriend={onRemoveFriend}
              onSelectFriend={onSelectFriend}
            />
          </div>
        </div>
      </XPWindow>
    </DesktopLayout>
  );
}
