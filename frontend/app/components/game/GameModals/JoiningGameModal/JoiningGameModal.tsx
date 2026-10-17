
"use client";

import XPModal from "@/app/components/ui/XPModal/XPModal";

interface Props {
	isOpen: boolean;
}

export default function JoiningGameModal({
	isOpen,
}: Props) {
	return (
		<XPModal
			title="Joining Game"
			isOpen={isOpen}
		>
			<div className="flex items-center gap-3.5 p-5 font-xp text-xp-md leading-[1.4] text-xp-gray-900">
				<div
					className="size-7 shrink-0 animate-spin rounded-full border-[3px] border-[#c5d8f5] border-t-[#245edb] motion-reduce:animate-none"
					aria-hidden="true"
				/>

				<div className="flex flex-col gap-1">
					<strong className="text-[15px]">
						Connecting to your friend...
					</strong>

					<span>
						Please wait while we prepare your game.
					</span>
				</div>
			</div>
		</XPModal>
	);
}
