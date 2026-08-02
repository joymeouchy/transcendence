"use client";

import ProfileHeader from "../ProfileHeader/ProfileHeader";
import ProfileStats from "../ProfileStats/ProfileStats";
import AccountInfo from "../AccountInfo/AccountInfo";
import AccountActions from "../AccountActions/AccountActions";
import FriendsPanel from "../FriendsPanel/FriendsPanel";

import DesktopLayout from "../../DesktopLayout/DesktopLayout";
import XPWindow from "../../ui/XPWindow/XPWindow";

import {
	Friend,
} from "@/services/friendships.service";

import { UserProfile } from "@/types/types.dto";

import styles from "./ProfilePageTemplate.module.scss";


interface ProfilePageTemplateProps {
	user?: UserProfile;

	friends: Friend[];

	loadingFriends: boolean;

	onClose?: () => void;

	isOwnProfile?: boolean;
}


export default function ProfilePageTemplate({
	user,
	friends,
	loadingFriends,
	onClose,
	isOwnProfile = false,
}: ProfilePageTemplateProps) {


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


						{isOwnProfile && (
							<div className={styles.groupBox}>

								<div className={styles.groupTitle}>
									Edit Profile
								</div>


								<AccountActions
									provider={user.provider}
									username={user.username}
								/>

							</div>
						)}


						<div className={styles.groupBox}>

							<div className={styles.groupTitle}>
								Status
							</div>


							<div className={styles.status}>
								{
									user.isOnline
										? "🟢 Online"
										: "⚫ Offline"
								}
							</div>

						</div>

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

							</div>



							<div className={styles.groupBox}>

								<div className={styles.groupTitle}>
									Account Info
								</div>


								<AccountInfo
									username={user.username}
									email={user.email}
									totalMatches={user.totalMatches}
								/>

							</div>


						</div>



						<div className={styles.groupBox}>

							<div className={styles.groupTitle}>
								Friends
							</div>


							<FriendsPanel
								friends={friends}
								loading={loadingFriends}
							/>

						</div>


					</section>


				</div>


			</XPWindow>


		</DesktopLayout>
	);
}