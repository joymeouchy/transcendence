"use client";

import { useRouter } from "next/navigation";

import ProfileHeader from "../ProfileHeader/ProfileHeader";
import ProfileStats from "../ProfileStats/ProfileStats";
import AccountInfo from "../AccountInfo/AccountInfo";
import AccountActions from "../AccountActions/AccountActions";
import FriendsPanel from "../FriendsPanel/FriendsPanel";

import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";
import XPGroupBox from "../../ui/XPGroupBox/XPGroupBox";

import { Friend } from "@/services/friendships.service";
import { UserProfile } from "@/types/types.dto";

import clsx from "clsx";
import styles from "./ProfilePageTemplate.module.scss";

const pageClass =
  "flex min-h-90 w-full min-w-0 gap-xp-md font-xp max-[900px]:flex-col max-[600px]:gap-xp-sm";
const statusClass = "text-xp-base max-[600px]:text-xp-sm";

interface ProfilePageTemplateProps {
  user?: UserProfile;
  friends: Friend[];
  loadingFriends: boolean;
  loadingProfile?: boolean;
  onClose?: () => void;
  isOwnProfile?: boolean;
  isFriend?: boolean;
  onAddFriend?: () => void | Promise<void>;
  onRemoveFriend?: () => void | Promise<void>;
}

export default function ProfilePageTemplate({
  user,
  friends,
  loadingFriends,
  loadingProfile = false,
  onClose,
  isOwnProfile = false,
  isFriend = false,
  onAddFriend,
  onRemoveFriend,
}: ProfilePageTemplateProps) {
  const router = useRouter();

  const canSeePrivateInfo = isOwnProfile || isFriend;

  return (
    <DesktopLayout>
      <XPWindow
        title="User Profile"
        onClose={onClose}
        isLoading={loadingProfile || loadingFriends}
        loadingMessage={
          loadingProfile ? "Loading friends..." : "Loading user profile..."
        }
      >
        <div className={pageClass}>
          {!user ? (
            !loadingProfile && (
              <div>Could not load user profile.</div>
            )
          ) : (
            <div className={pageClass}>
              <aside className="flex w-65 min-w-0 shrink-0 flex-col gap-xp-md max-[900px]:w-full max-[600px]:gap-xp-sm">
                <ProfileHeader
                  username={user.username}
                  avatarUrl={user.avatarUrl}
                />

                <XPGroupBox title="Account Actions">
                  <AccountActions
                    provider={user.provider}
                    username={user.username}
                    isOwnProfile={isOwnProfile}
                    isFriend={isFriend}
                    onAddFriend={onAddFriend}
                    onRemoveFriend={onRemoveFriend}
                  />
                </XPGroupBox>

                {canSeePrivateInfo && (
                  <XPGroupBox title="Status">
                    <div className={statusClass}>
                      {user.isOnline ? "🟢 Online" : "⚫ Offline"}
                    </div>
                  </XPGroupBox>
                )}
              </aside>

              <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-xp-md max-[900px]:w-full max-[600px]:gap-xp-sm">
                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-xp-md max-[900px]:grid-cols-[1fr]">
                  <XPGroupBox title="Game Statistics">
                    <ProfileStats
                      wins={user.wins}
                      losses={user.losses}
                      winRate={user.winRate}
                    />

                    {isOwnProfile && (
                      <button
                        className={clsx(
                          styles.statsButton,
                          "mt-xp-sm w-full px-2.5 py-1.25 font-xp text-xp-sm text-xp-ink",
                        )}
                        onClick={() => router.push("/gameStats")}
                      >
                        View Full Stats
                      </button>
                    )}
                  </XPGroupBox>

                  {canSeePrivateInfo && (
                    <XPGroupBox title="Account Info">
                      <AccountInfo
                        username={user.username}
                        email={user.email ?? ""}
                        totalMatches={user.totalMatches}
                      />
                    </XPGroupBox>
                  )}
                </div>

                <XPGroupBox title="Friends">
                  {canSeePrivateInfo ? (
                    <FriendsPanel friends={friends} loading={loadingFriends} />
                  ) : (
                    <div className={statusClass}>
                      Add this user as a friend to see their friends.
                    </div>
                  )}
                </XPGroupBox>
              </section>
            </div>
          )}
        </div>
      </XPWindow>
    </DesktopLayout>
  );
}
