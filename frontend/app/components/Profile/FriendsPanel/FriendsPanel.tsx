"use client";

import Link from "next/link";

import styles from "./FriendsPanel.module.scss";

import {
	Friend,
} from "@/services/friendships.service";


type Props = {
	friends: Friend[];
	loading: boolean;
};


export default function FriendsPanel({
	friends,
	loading,
}: Props) {


	return (
		<div className={styles.groupBox}>

			<div className={styles.list}>

				{
					loading ?

					<div>
						Loading...
					</div>

					:

					friends.map((friend) => (

						<Link
							key={friend.id}
							href={`/profile/${friend.id}`}
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

						</Link>

					))

				}

			</div>

		</div>
	);
}