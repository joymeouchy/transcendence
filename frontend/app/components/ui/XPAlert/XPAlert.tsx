"use client";

import XPModal from "../XPModal/XPModal";

import styles from "./XPAlert.module.scss";

interface Props {
	isOpen: boolean;
	title?: string;
	message: string;
	onClose: () => void;
	onConfirm?: () => void;
	showCancel?: boolean;
}

export default function XPAlert({
	isOpen,
	title = "Alert",
	message,
	onClose,
	onConfirm,
	showCancel = false,
}: Props) {
	const handleConfirm = () => {
		onConfirm?.();
		onClose();
	};

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

				<div className={styles.actions}>
					<button
						className={styles.button}
						onClick={handleConfirm}
					>
						OK
					</button>

					{showCancel && (
						<button
							className={styles.button}
							onClick={onClose}
						>
							Cancel
						</button>
					)}
				</div>
			</div>
		</XPModal>
	);
}