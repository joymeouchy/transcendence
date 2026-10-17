"use client";

import { useState } from "react";
import { Friend } from "@/types/types.dto";
import clsx from "clsx";
import styles from "./FriendListPanel.module.scss";
import XPListPanel, { XPListEmpty } from "../../ui/XPListPanel/XPListPanel";
import XPStatusDot from "../../ui/XPStatusDot/XPStatusDot";
import { useRouter } from "next/navigation";

interface Props {
  friends: Friend[];
  onRemoveFriend?: (friendshipId: number) => Promise<void>;
  onSelectFriend?: (friend: Friend) => void;
  selectedFriendId?: number;
  unreadCounts?: Record<number, number>;
}

export default function FriendsListPanel({
  friends,
  onRemoveFriend,
  onSelectFriend,
  selectedFriendId,
  unreadCounts,
}: Props) {
  const [removingFriendId, setRemovingFriendId] = useState<number | null>(null);
  const router = useRouter();

  async function handleRemoveFriend(friendshipId: number) {
    try {
      setRemovingFriendId(friendshipId);
      await onRemoveFriend?.(friendshipId);
    } catch (err) {
    } finally {
      setRemovingFriendId(null);
    }
  }

  return (
    <XPListPanel title="Friends" className="size-full min-h-0">
        {friends.length === 0 ? (
          <XPListEmpty>No friends yet</XPListEmpty>
        ) : (
          friends.map((friend) => {
            const unreadCount = unreadCounts?.[friend.id] ?? 0;
            const isSelected = selectedFriendId === friend.id;

            return (
              <div
	key={friend.friendshipId}
	className={clsx(
		styles.friend,
		"flex cursor-pointer items-center justify-between gap-2 px-2 py-1.5 font-xp text-xp-sm text-xp-gray-900 max-[450px]:flex-col max-[450px]:items-start",
	)}
	role="button"
	tabIndex={0}
	onClick={() => onSelectFriend?.(friend)}
	onKeyDown={(e) => {
		if (e.target !== e.currentTarget) return;

		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onSelectFriend?.(friend);
		}
	}}
>
                <div className="flex min-w-0 items-center gap-1.5">
                  <XPStatusDot online={friend.isOnline} />
                  {friend.username}
                </div>

                {unreadCount > 0 && (
                  <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-[9px] bg-xp-focus px-1.25 text-xp-sm font-bold text-xp-white">{unreadCount}</span>
                )}

                {onRemoveFriend && (
                  <button
                    className={clsx(
                      styles.friendButton,
                      "min-w-19.5 px-1.75 py-1 font-xp text-xp-xs whitespace-nowrap max-[450px]:w-full",
                    )}
                    disabled={removingFriendId === friend.friendshipId}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFriend(friend.friendshipId);
                    }}
                  >
                    {removingFriendId === friend.friendshipId
                      ? "Removing..."
                      : "Remove"}
                  </button>
                )}
              </div>
            );
          })
        )}
    </XPListPanel>
  );
}
