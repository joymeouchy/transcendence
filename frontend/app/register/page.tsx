"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { authService } from "@/services/auth.services";
import { isAuthenticated } from "@/lib/auth";

import AuthLayout from "../components/auth/AuthLayout";
import AuthPanel from "../components/auth/AuthPanel";
import XPAlert from "../components/ui/XPAlert/XPAlert";

import { registerFields } from "../data/auth/registerFields";

export default function RegisterPage() {
	const router = useRouter();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [alertMessage, setAlertMessage] =
		useState<string | null>(null);

	const [alertTitle, setAlertTitle] =
		useState("Alert");

	useEffect(() => {
		if (isAuthenticated()) {
			router.replace("/home");
		}
	}, [router]);

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		if (
			formData.password !==
			formData.confirmPassword
		) {
			setAlertTitle(
				"Password Error"
			);

			setAlertMessage(
				"Passwords do not match"
			);

			return;
		}

		try {
			const response =
				await authService.register({
					username: formData.username,
					email: formData.email,
					password: formData.password,
				});

			console.log(
				"Register success:",
				response
			);

			setAlertTitle(
				"Success"
			);

			setAlertMessage(
				"Registration successful"
			);

			setTimeout(() => {
				router.replace("/home");
			}, 1000);

		} catch (err) {
			console.error(
				"Register error:",
				err
			);

			if (axios.isAxiosError(err)) {
				setAlertTitle(
					"Registration Failed"
				);

				setAlertMessage(
					err.response?.data?.error ||
					err.response?.data?.message ||
					"Registration failed"
				);
			} else {
				setAlertTitle(
					"Registration Failed"
				);

				setAlertMessage(
					"Something went wrong"
				);
			}
		}
	};

	return (
		<AuthLayout>
			<AuthPanel>
				<form
					onSubmit={handleSubmit}
					className="xp-form"
				>
					<h3 className="xp-title">
						Register for PONG
					</h3>

					{registerFields.map((field) => (
						<div
							key={field.key}
							className="xp-field"
						>
							<label className="xp-label">
								{field.label}
							</label>

							<input
								type={field.type}
								placeholder={field.placeholder}
								value={
									formData[
										field.key as keyof typeof formData
									]
								}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										[
											field.key as keyof typeof formData
										]: e.target.value,
									}))
								}
								className="xp-input"
								required={field.required}
							/>
						</div>
					))}

					<button
						type="submit"
						className="xp-submit"
					>
						Register
					</button>
				</form>

				<Link
					href="/login"
					className="xp-link"
				>
					Already a user? Login
				</Link>
			</AuthPanel>

			<XPAlert
				isOpen={
					alertMessage !== null
				}
				title={
					alertTitle
				}
				message={
					alertMessage ?? ""
				}
				onClose={() =>
					setAlertMessage(null)
				}
			/>
		</AuthLayout>
	);
}