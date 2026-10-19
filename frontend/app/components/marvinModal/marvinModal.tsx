"use client";

import { useEffect, useState } from "react";
import XPModal from "../ui/XPModal/XPModal";
import clsx from "clsx";
import styles from "./marvinModal.module.scss";

const headingClass = "mb-xp-md text-center text-xp-xl font-bold";
const descriptionClass = "mb-xp-md text-center text-xp-base";
const actionsClass = "mt-xp-lg flex justify-end gap-2";
const buttonClass = clsx(styles.button, "min-w-22.5 px-3.5 py-1.25 font-xp text-xp-base");
import { MARVIN_CONFIG, marvinAnswers } from "./marvinConfig";

type Stage = "ask" | "thinking" | "answer";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export default function MarvinModal({
	isOpen,
	onClose,
}: Props) {
	const [question, setQuestion] = useState("");
	const [stage, setStage] = useState<Stage>("ask");
	const [answer, setAnswer] = useState("");

	const reset = () => {
		setQuestion("");
		setAnswer("");
		setStage("ask");
	};

	useEffect(() => {
		if (!isOpen) {
			reset();
		}
	}, [isOpen]);

	const askMarvin = () => {
		if (!question.trim()) {
			return;
		}

		setStage("thinking");

		setTimeout(() => {
			const randomAnswer =
				marvinAnswers[
					Math.floor(
						Math.random() * marvinAnswers.length
					)
				];

			setAnswer(randomAnswer);
			setStage("answer");
		}, MARVIN_CONFIG.thinkingDuration);
	};

	const handleBack = () => {
		reset();
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const renderAsk = () => {
		return (
			<>
				<div className={headingClass}>
					{MARVIN_CONFIG.heading}
				</div>

				<p className={descriptionClass}>
					{MARVIN_CONFIG.askDescription}
				</p>

				<textarea
					className={clsx(styles.input, "w-full resize-none border border-xp-gray-500 bg-xp-white p-1.5 font-xp text-xp-base outline-none")}
					value={question}
					onChange={(e) =>
						setQuestion(e.target.value)
					}
					onKeyDown={(e) => {
						if (
							e.key === "Enter" &&
							!e.shiftKey
						) {
							e.preventDefault();
							askMarvin();
						}
					}}
					placeholder={MARVIN_CONFIG.placeholder}
					rows={3}
				/>

				<div className={actionsClass}>
					<button
						className={buttonClass}
						onClick={askMarvin}
						disabled={!question.trim()}
					>
						{MARVIN_CONFIG.askButton}
					</button>
				</div>
			</>
		);
	};

	const renderThinking = () => {
		return (
			<div className="text-center">
				<div className={headingClass}>
					{MARVIN_CONFIG.thinkingHeading}
				</div>

				<p className={descriptionClass}>
					{MARVIN_CONFIG.thinkingDescription}
				</p>

				<div className="mt-xp-lg h-4.5 w-full border border-xp-gray-500 bg-xp-white p-0.5">
					<div className={clsx(styles.progressBar, "h-full bg-xp-highlight")} />
				</div>

				<p className="mt-2 text-xp-sm italic">
					{MARVIN_CONFIG.thinkingText}
				</p>
			</div>
		);
	};

	const renderAnswer = () => {
		return (
			<div className="text-center">
				<div className={headingClass}>
					{MARVIN_CONFIG.answerHeading}
				</div>

				<div className={clsx(styles.answer, "mx-0 my-xp-lg flex min-h-20 items-center justify-center bg-xp-gray-10 p-4 text-[15px] leading-normal italic")}>
					"{answer}"
				</div>

				<div className={actionsClass}>
					<button
						className={buttonClass}
						onClick={handleBack}
					>
						{MARVIN_CONFIG.askAgainButton}
					</button>

					<button
						className={buttonClass}
						onClick={handleClose}
					>
						{MARVIN_CONFIG.closeButton}
					</button>
				</div>
			</div>
		);
	};

	const renderContent = () => {
		switch (stage) {
			case "ask":
				return renderAsk();

			case "thinking":
				return renderThinking();

			case "answer":
				return renderAnswer();

			default:
				return null;
		}
	};

	return (
		<XPModal
			title="Marvin"
			isOpen={isOpen}
			onClose={handleClose}
		>
			{/* width lives on the content so XPWindow's own max-width keeps the frame snug on phones */}
			<div className="w-98 max-w-full p-xp-lg font-xp text-xp-black max-[450px]:p-xp-sm">
				{renderContent()}
			</div>
		</XPModal>
	);
}
