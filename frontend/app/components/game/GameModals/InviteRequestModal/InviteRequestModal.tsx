"use client";

import XPModal from "@/app/components/ui/XPModal/XPModal";
import "./InviteRequestModal.scss";


interface Props {
	isOpen: boolean;
	username: string;
	avatarUrl: string | null;
	onAccept: () => void;
	onDecline: () => void;
	onClose: () => void;
}

export default function InviteRequestModal({
	isOpen,
	username,
	avatarUrl,
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
			<div className="invite-content">
				{avatarUrl ? (
					<img
						src={avatarUrl}
						alt={`${username}'s avatar`}
						className="invite-avatar"
					/>
				) : (
					<div className="invite-avatar invite-avatar-placeholder">
						{username.charAt(0).toUpperCase()}
					</div>
				)}

				<div className="invite-message">
					<strong>{username}</strong>
					<span>has invited you to play Pong!</span>
				</div>
			</div>

			<div className="invite-actions">
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