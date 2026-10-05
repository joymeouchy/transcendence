"use client";

import { useRouter } from "next/navigation";

import ProfileHeader from "../ProfileHeader/ProfileHeader";
import ProfileStats from "../ProfileStats/ProfileStats";
import AccountInfo from "../AccountInfo/AccountInfo";
import AccountActions from "../AccountActions/AccountActions";
import FriendsPanel from "../FriendsPanel/FriendsPanel";

import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";

import { Friend } from "@/services/friendships.service";
import { UserProfile } from "@/types/types.dto";

import styles from "./ProfilePageTemplate.module.scss";

interface ProfilePageTemplateProps {
	user?: UserProfile;
	friends: Friend[];
	loadingFriends: boolean;
	onClose?: () => void;
	isOwnProfile?: boolean;
	isFriend?: boolean;
	onAddFriend?: () => void;
	onRemoveFriend?: () => void;
}

export default function ProfilePageTemplate({
	user,
	friends,
	loadingFriends,
	onClose,
	isOwnProfile = false,
	isFriend = false,
	onAddFriend,
	onRemoveFriend,
}: ProfilePageTemplateProps) {
	const router = useRouter();

	if (!user) {
		return (
			<DesktopLayout>
				<XPWindow
					title="User Profile"
					onClose={onClose}
				>
					<div className={styles.loading}>
						Loading user profile...
					</div>
				</XPWindow>
			</DesktopLayout>
		);
	}

	const canSeePrivateInfo =
		isOwnProfile || isFriend;

	return (
		<DesktopLayout>
			<XPWindow
				title="User Profile"
				onClose={onClose}
			>
				<div className={styles.page}>
					<aside className={styles.leftPanel}>
						<ProfileHeader
							username={user.username}
							avatarUrl={user.avatarUrl}
						/>

						<div className={styles.groupBox}>
							<div className={styles.groupTitle}>
								Account Actions
							</div>

							<AccountActions
								provider={user.provider}
								username={user.username}
								isOwnProfile={isOwnProfile}
								isFriend={isFriend}
								onAddFriend={onAddFriend}
								onRemoveFriend={onRemoveFriend}
							/>
						</div>

						{canSeePrivateInfo && (
							<div className={styles.groupBox}>
								<div className={styles.groupTitle}>
									Status
								</div>

								<div className={styles.status}>
									{user.isOnline
										? "🟢 Online"
										: "⚫ Offline"}
								</div>
							</div>
						)}
					</aside>

					<section className={styles.rightPanel}>
						<div className={styles.topRow}>
							<div className={styles.groupBox}>
								<div className={styles.groupTitle}>
									Game Statistics
								</div>

								<ProfileStats
									wins={user.wins}
									losses={user.losses}
									winRate={user.winRate}
								/>
								{isOwnProfile && (
									<button
										className={styles.statsButton}
										onClick={() =>
											router.push("/gameStats")
										}
									>
										View Full Stats
									</button>
								)}
							</div>

							{canSeePrivateInfo && (
								<div className={styles.groupBox}>
									<div className={styles.groupTitle}>
										Account Info
									</div>

									<AccountInfo
										username={user.username}
										email={user.email ?? ""}
										totalMatches={user.totalMatches}
									/>
								</div>
							)}
						</div>

						<div className={styles.groupBox}>
							<div className={styles.groupTitle}>
								Friends
							</div>

							{canSeePrivateInfo ? (
								<FriendsPanel
									friends={friends}
									loading={loadingFriends}
								/>
							) : (
								<div className={styles.status}>
									Add this user as a friend to see their friends.
								</div>
							)}
						</div>
					</section>
				</div>
			</XPWindow>
		</DesktopLayout>
	);
}
