"use client";

import { useEffect, useState } from "react";
import XPModal from "../ui/XPModal/XPModal";
import { playSound, sounds } from "@/lib/sounds";
import styles from "./deepThoughtModal.module.scss";

type Question = "answer" | "ultimate";
type Stage = "selection" | "calculating" | "result";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export default function DeepThoughtModal({
	isOpen,
	onClose,
}: Props) {
	const [question, setQuestion] = useState<Question | null>(null);
	const [stage, setStage] = useState<Stage>("selection");
	const [progress, setProgress] = useState(0);

	const startCalculation = (selectedQuestion: Question) => {
		setQuestion(selectedQuestion);
		setProgress(0);
		setStage("calculating");
	};

	useEffect(() => {
		if (!isOpen || stage !== "calculating" || !question) {
			return;
		}

		const duration = question === "answer" ? 7500 : 10000;
		const intervalTime = 75;
		const totalSteps = duration / intervalTime;

		let step = 0;
		let stallTimeout: ReturnType<typeof setTimeout> | null = null;

		const interval = setInterval(() => {
			step++;

			const linearProgress = step / totalSteps;

			/*
			 * Ease-out curve:
			 *
			 * Starts quickly and gradually slows down
			 * as it approaches 100%.
			 */
			const easedProgress =
				1 - Math.pow(1 - linearProgress, 3);

			const maxProgress =
				question === "ultimate" ? 99.8 : 100;

			const nextProgress = Math.min(
				easedProgress * maxProgress,
				maxProgress
			);

			setProgress(nextProgress);

			if (step >= totalSteps) {
				clearInterval(interval);

				if (question === "ultimate") {
					setProgress(99.8);

					// Stay at 99.8% for 3 seconds
					stallTimeout = setTimeout(() => {
						playSound(sounds.alert);
						setStage("result");
					}, 2000);
				} else {
					setProgress(100);

					// Small pause before revealing 42
					stallTimeout = setTimeout(() => {
						setStage("result");
					}, 500);
				}
			}
		}, intervalTime);

		return () => {
			clearInterval(interval);

			if (stallTimeout) {
				clearTimeout(stallTimeout);
			}
		};
	}, [isOpen, stage, question]);

	const handleClose = () => {
		setQuestion(null);
		setStage("selection");
		setProgress(0);
		onClose();
	};

	const handleBack = () => {
		setQuestion(null);
		setStage("selection");
		setProgress(0);
	};

	return (
		<XPModal
			title="Deep Thought"
			isOpen={isOpen}
			onClose={handleClose}
			className={styles.modal}
		>
			<div className={styles.content}>
				{stage === "selection" && (
					<>
						<div className={styles.heading}>
							DEEP THOUGHT
						</div>

						<p className={styles.description}>
							What would you like to calculate?
						</p>

						<div className={styles.questions}>
							<button
								className={styles.questionButton}
								onClick={() =>
									startCalculation("answer")
								}
							>
								The Answer to Life, the Universe,
								and Everything
							</button>

							<button
								className={styles.questionButton}
								onClick={() =>
									startCalculation("ultimate")
								}
							>
								The Ultimate Question
							</button>
						</div>
					</>
				)}

				{stage === "calculating" && (
					<div className={styles.calculating}>
						<div className={styles.heading}>
							DEEP THOUGHT IS CALCULATING...
						</div>

						<p className={styles.description}>
							{question === "answer"
								? "Calculating the Answer to Life, the Universe, and Everything..."
								: "Calculating the Ultimate Question..."}
						</p>

						<div className={styles.progressContainer}>
							<div
								className={styles.progressBar}
								style={{
									width: `${progress}%`,
								}}
							/>
						</div>

						<div className={styles.progressText}>
							{progress.toFixed(1)}%
						</div>

						<p className={styles.estimatedTime}>
							Estimated calculation time:
							<br />
							<strong>
								{question === "answer"
									? "7,500,000 years"
									: "10,000,000 years"}
							</strong>
						</p>
					</div>
				)}

				{stage === "result" &&
					question === "answer" && (
						<div className={styles.result}>
							<div className={styles.heading}>
								CALCULATION COMPLETE
							</div>

							<p>
								The Answer to Life, the Universe,
								and Everything is:
							</p>

							<div className={styles.answer}>
								42
							</div>

							<button
								className={styles.button}
								onClick={handleBack}
							>
								Back
							</button>
						</div>
					)}

				{stage === "result" &&
					question === "ultimate" && (
						<div className={styles.error}>
							<div className={styles.errorTitle}>
								ERROR 404
							</div>

							<p>
								Earth not found.
							</p>

							<p>
								The planet Earth has been destroyed
								to make way for a hyperspace bypass.
							</p>

							<button
								className={styles.button}
								onClick={handleBack}
							>
								OK
							</button>
						</div>
					)}
			</div>
		</XPModal>
	);
}