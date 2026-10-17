"use client";

import { useEffect, useState } from "react";

import XPModal from "../../ui/XPModal/XPModal";
import XPAlert from "../../ui/XPAlert/XPAlert";

import { UserService } from "@/services/user.services";
import { useAuth } from "@/context/AuthContext";

type ChangeUsernameModalProps = {
	isOpen: boolean;
	onClose: () => void;
	currentUsername: string;
};

export default function ChangeUsernameModal({
	isOpen,
	onClose,
	currentUsername,
}: ChangeUsernameModalProps) {
	const { refreshUser } = useAuth();

	const [username, setUsername] = useState(currentUsername);

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	// Update input whenever the modal opens or username changes
	useEffect(() => {
		if (isOpen) {
			setUsername(currentUsername);
			setError("");
		}
	}, [isOpen, currentUsername]);

	const handleClose = () => {
		setUsername(currentUsername);
		setError("");
		setLoading(false);
		onClose();
	};

	const handleSubmit = async () => {
		setError("");

		if (!username.trim()) {
			setError("Username is required.");
			return;
		}

		if (username.trim() === currentUsername) {
			setError("Please enter a different username.");
			return;
		}

		try {
			setLoading(true);

			await UserService.updateUsername(
				username.trim()
			);

			await refreshUser();

			onClose();
			setShowSuccess(true);

		} catch (err: any) {
			setError(
				err?.response?.data?.error ??
				"Failed to update username."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<XPModal
				title="Change Username"
				isOpen={isOpen}
				onClose={handleClose}
			>
				<div className="flex flex-col gap-3.75">
					<label>
						Username
						<input
							type="text"
							value={username}
							onChange={(e) =>
								setUsername(e.target.value)
							}
							disabled={loading}
						/>
					</label>

					{error && (
						<p className="text-xp-md text-xp-danger-bright">
							{error}
						</p>
					)}

					<div className="flex justify-end gap-2.5">
						<button
							className="cursor-pointer"
							type="button"
							onClick={handleClose}
							disabled={loading}
						>
							Cancel
						</button>

						<button
							className="cursor-pointer"
							type="button"
							onClick={handleSubmit}
							disabled={loading}
						>
							{loading
								? "Saving..."
								: "Save"}
						</button>
					</div>
				</div>
			</XPModal>

			<XPAlert
				isOpen={showSuccess}
				title="Success"
				message="Username updated successfully."
				onClose={() =>
					setShowSuccess(false)
				}
			/>
		</>
	);
}