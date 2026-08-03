"use client";

import XPModal from "../../../ui/XPModal/XPModal";

type Props = {
	isOpen: boolean;

	opponentName: string;

	onAccept: () => void;
	onDecline: () => void;
};


export default function RematchRequestModal({
	isOpen,
	opponentName,
	onAccept,
	onDecline,
}: Props) {

	return (
		<XPModal
			title="Rematch Request"
			isOpen={isOpen}
		>

			<div>

				<h2>
					{opponentName} wants a rematch!
				</h2>


				<div className="buttons">

					<button onClick={onAccept}>
						Accept
					</button>


					<button onClick={onDecline}>
						Decline
					</button>

				</div>

			</div>

		</XPModal>
	);
}