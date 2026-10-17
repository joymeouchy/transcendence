"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { authService } from "@/services/auth.services";

import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";
import AuthField from "../components/auth/AuthField";
import AuthButton from "../components/auth/AuthButton";
import AuthLink from "../components/auth/AuthLink";
import XPAlert from "../components/ui/XPAlert/XPAlert";

export default function ResetPasswordContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const token = searchParams.get("token");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [alertMessage, setAlertMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		if (!token) {
			setAlertMessage("Invalid reset link");
			return;
		}

		if (password !== confirmPassword) {
			setAlertMessage("Passwords do not match");
			return;
		}

		setIsLoading(true);

		try {
			const res = await authService.resetPassword(
				token,
				password
			);

			setAlertMessage(res.message);

			setTimeout(() => {
				router.push("/login");
			}, 1500);
		} catch (err) {
			setAlertMessage(
				"Unable to reset your password. The link may have expired."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout>
			<AuthPanel>
				<form onSubmit={handleSubmit} className="xp-form flex flex-col items-stretch gap-2.5">
					<h3 className="xp-title text-xp-md font-bold">Reset Password</h3>

					<AuthField
						id="password"
						label="New Password"
						type="password"
						placeholder="New password"
						value={password}
						onChange={(e) =>
							setPassword(e.target.value)
						}
						required
						disabled={isLoading}
					/>

					<AuthField
						id="confirmPassword"
						label="Confirm Password"
						type="password"
						placeholder="Confirm password"
						value={confirmPassword}
						onChange={(e) =>
							setConfirmPassword(e.target.value)
						}
						required
						disabled={isLoading}
					/>

					<AuthButton
						type="submit"
						disabled={isLoading}
					>
						{isLoading
							? "Resetting..."
							: "Reset Password"}
					</AuthButton>
				</form>

				<AuthLink href="/login">
					Back to login
				</AuthLink>
			</AuthPanel>

			<XPAlert
				isOpen={alertMessage !== null}
				message={alertMessage ?? ""}
				onClose={() => setAlertMessage(null)}
			/>
		</AuthLayout>
	);
}