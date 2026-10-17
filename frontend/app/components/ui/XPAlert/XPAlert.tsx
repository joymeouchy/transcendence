"use client";

import XPModal from "../XPModal/XPModal";

import clsx from "clsx";

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
			<div className="flex min-w-62.5 flex-col items-center gap-5 p-5">
				<div className="text-center">
					{message}
				</div>

				<div
					className={clsx(
						"flex w-45",
						showCancel ? "justify-between" : "justify-center",
					)}
				>
					<button
						className="min-w-17.5 cursor-pointer px-4 py-1"
						onClick={handleConfirm}
					>
						OK
					</button>

					{showCancel && (
						<button
							className="min-w-17.5 cursor-pointer px-4 py-1"
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