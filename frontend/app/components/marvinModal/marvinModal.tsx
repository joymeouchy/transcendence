"use client";

import { useEffect, useState } from "react";
import XPModal from "../ui/XPModal/XPModal";
import styles from "./marvinModal.module.scss";
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
				<div className={styles.heading}>
					{MARVIN_CONFIG.heading}
				</div>

				<p className={styles.description}>
					{MARVIN_CONFIG.askDescription}
				</p>

				<textarea
					className={styles.input}
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

				<div className={styles.actions}>
					<button
						className={styles.button}
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
			<div className={styles.thinking}>
				<div className={styles.heading}>
					{MARVIN_CONFIG.thinkingHeading}
				</div>

				<p className={styles.description}>
					{MARVIN_CONFIG.thinkingDescription}
				</p>

				<div className={styles.progressContainer}>
					<div className={styles.progressBar} />
				</div>

				<p className={styles.thinkingText}>
					{MARVIN_CONFIG.thinkingText}
				</p>
			</div>
		);
	};

	const renderAnswer = () => {
		return (
			<div className={styles.result}>
				<div className={styles.heading}>
					{MARVIN_CONFIG.answerHeading}
				</div>

				<div className={styles.answer}>
					"{answer}"
				</div>

				<div className={styles.actions}>
					<button
						className={styles.button}
						onClick={handleBack}
					>
						{MARVIN_CONFIG.askAgainButton}
					</button>

					<button
						className={styles.button}
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
			className={styles.modal}
		>
			<div className={styles.content}>
				{renderContent()}
			</div>
		</XPModal>
	);
}
