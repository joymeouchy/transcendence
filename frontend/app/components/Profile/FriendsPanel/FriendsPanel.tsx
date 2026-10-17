"use client";

import Link from "next/link";

import clsx from "clsx";
import styles from "./FriendsPanel.module.scss";
import XPStatusDot from "../../ui/XPStatusDot/XPStatusDot";

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
		<div>
			<div className="max-h-35 overflow-x-hidden overflow-y-auto border-none bg-xp-white">
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
							className={clsx(
								styles.friend,
								"flex min-w-0 cursor-pointer items-center gap-2 px-2 py-1.25 font-xp text-xp-sm text-inherit no-underline max-[500px]:px-1.75 max-[500px]:text-xp-xs",
							)}
						>
							<XPStatusDot online={friend.isOnline} />
							{friend.username}
						</Link>
					))
				}
			</div>
		</div>
	);
}