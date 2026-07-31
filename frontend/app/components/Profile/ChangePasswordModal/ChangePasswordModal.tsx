"use client";

import { useState } from "react";

import XPModal from "../../ui/XPModal/XPModal";
import XPAlert from "../../ui/XPAlert/XPAlert";

import { authService } from "@/services/auth.services";

import styles from "./ChangePasswordModal.module.scss";

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
				<div className={styles.form}>
					<label>
						Current Password
						<input
							type="password"
							value={currentPassword}
							onChange={(e) =>
								setCurrentPassword(e.target.value)
							}
						/>
					</label>

					<label>
						New Password
						<input
							type="password"
							value={newPassword}
							onChange={(e) =>
								setNewPassword(e.target.value)
							}
						/>
					</label>

					<label>
						Confirm New Password
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) =>
								setConfirmPassword(e.target.value)
							}
						/>
					</label>

					{error && (
						<p className={styles.error}>
							{error}
						</p>
					)}

					<div className={styles.actions}>
						<button
							type="button"
							onClick={handleClose}
							disabled={loading}
						>
							Cancel
						</button>

						<button
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