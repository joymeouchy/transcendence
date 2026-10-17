"use client";

import { useState } from "react";

import XPModal from "../../ui/XPModal/XPModal";
import XPAlert from "../../ui/XPAlert/XPAlert";

import { authService } from "@/services/auth.services";

type ChangePasswordModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function ChangePasswordModal({
	isOpen,
	onClose,
}: ChangePasswordModalProps) {
	const [currentPassword, setCurrentPassword] =
		useState("");
	const [newPassword, setNewPassword] =
		useState("");
	const [confirmPassword, setConfirmPassword] =
		useState("");

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const [showSuccess, setShowSuccess] =
		useState(false);
	const [successMessage, setSuccessMessage] =
		useState("");

	const resetForm = () => {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setError("");
		setLoading(false);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleSubmit = async () => {
		setError("");

		if (
			!currentPassword ||
			!newPassword ||
			!confirmPassword
		) {
			setError("Please fill in all fields.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			setLoading(true);

			const { message } =
				await authService.changePassword(
					currentPassword,
					newPassword
				);

			resetForm();
			onClose();

			setSuccessMessage(message);
			setShowSuccess(true);
		} catch (err: any) {
			setError(
				err?.response?.data?.error ||
				"Failed to change password."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<XPModal
				title="Change Password"
				isOpen={isOpen}
				onClose={handleClose}
			>
				<div className="flex flex-col gap-3.5">
					<label className="flex flex-col gap-1.5 text-xp-md font-semibold">
						Current Password
						<input
							className="p-2 text-xp-lg"
							type="password"
							value={currentPassword}
							onChange={(e) =>
								setCurrentPassword(e.target.value)
							}
						/>
					</label>

					<label className="flex flex-col gap-1.5 text-xp-md font-semibold">
						New Password
						<input
							className="p-2 text-xp-lg"
							type="password"
							value={newPassword}
							onChange={(e) =>
								setNewPassword(e.target.value)
							}
						/>
					</label>

					<label className="flex flex-col gap-1.5 text-xp-md font-semibold">
						Confirm New Password
						<input
							className="p-2 text-xp-lg"
							type="password"
							value={confirmPassword}
							onChange={(e) =>
								setConfirmPassword(e.target.value)
							}
						/>
					</label>

					{error && (
						<p className="text-xp-md text-xp-danger">
							{error}
						</p>
					)}

					<div className="mt-2 flex justify-end gap-2.5">
						<button
							className="cursor-pointer px-4 py-2"
							type="button"
							onClick={handleClose}
							disabled={loading}
						>
							Cancel
						</button>

						<button
							className="cursor-pointer px-4 py-2"
							type="button"
							onClick={handleSubmit}
							disabled={loading}
						>
							{loading
								? "Changing..."
								: "Change Password"}
						</button>
					</div>
				</div>
			</XPModal>

			<XPAlert
				isOpen={showSuccess}
				title="Success"
				message={successMessage}
				onClose={() => {
					setShowSuccess(false);
					setSuccessMessage("");
				}}
			/>
		</>
	);
}