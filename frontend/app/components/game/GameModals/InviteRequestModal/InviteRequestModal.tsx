"use client";

import XPModal from "@/app/components/ui/XPModal/XPModal";
import clsx from "clsx";
import "./InviteRequestModal.scss";

const avatarClass =
	"invite-avatar size-14 shrink-0 rounded-xp-2xs border border-xp-border-dark bg-xp-white object-cover";


interface Props {
	isOpen: boolean;
	username: string;
	avatarUrl: string | null;
	winningScore: number;
	onAccept: () => void;
	onDecline: () => void;
	onClose: () => void;
}

export default function InviteRequestModal({
	isOpen,
	username,
	avatarUrl,
	winningScore,
	onAccept,
	onDecline,
	onClose,
}: Props) {
	return (
		<XPModal
			title="Game Invite"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="invite-content flex items-center gap-3.5 p-5 max-[450px]:gap-xp-md max-[450px]:p-xp-md">
				{avatarUrl ? (
					<img
						src={avatarUrl}
						alt={`${username}'s avatar`}
						className={avatarClass}
					/>
				) : (
					<div className={clsx(avatarClass, "invite-avatar-placeholder flex items-center justify-center text-xp-4xl font-bold text-xp-invite-ink")}>
						{username.charAt(0).toUpperCase()}
					</div>
				)}

				<div className="flex min-w-0 flex-col gap-1.25 font-xp text-xp-md leading-[1.4] text-xp-gray-900">
					<strong className="text-[15px] text-xp-invite-name [overflow-wrap:anywhere]">{username}</strong>
					<span>has invited you to play Pong!</span>
					<span>First to <strong>{winningScore}</strong> points wins.</span>
				</div>
			</div>

			<div className="flex justify-between bg-xp-invite-bg px-10 pt-0 pb-1.5 max-[450px]:px-xp-md">
				<button
					className="invite-button accept"
					onClick={onAccept}
				>
					Accept
				</button>

				<button
					className="invite-button decline"
					onClick={onDecline}
				>
					Decline
				</button>
			</div>
		</XPModal>
	);
}