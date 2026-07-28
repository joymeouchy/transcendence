"use client";

import XPModal from "../XPModal/XPModal";

import styles from "./XPAlert.module.scss";

interface Props {
	isOpen: boolean;

	title?: string;

	message: string;

	onClose: () => void;
}

export default function XPAlert({
	isOpen,
	title = "Alert",
	message,
	onClose,
}: Props) {
	return (
		<XPModal
			title={title}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className={styles.alert}>
				<div className={styles.message}>
					{message}
				</div>

				<button
					className={styles.button}
					onClick={onClose}
				>
					OK
				</button>
			</div>
		</XPModal>
	);
}