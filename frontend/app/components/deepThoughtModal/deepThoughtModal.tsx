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

const QUESTION_CONFIG = {
	answer: {
		buttonLabel:
			"The Answer to Life, the Universe, and Everything",

		calculationDescription:
			"Calculating the Answer to Life, the Universe, and Everything...",

		estimatedTime: "7,500,000 years",

		duration: 7500,
		maxProgress: 100,
		resultDelay: 500,

		result: {
			title: "CALCULATION COMPLETE",
			description:
				"The Answer to Life, the Universe, and Everything is:",
			answer: "42",
			buttonLabel: "Back",
		},
	},

	ultimate: {
		buttonLabel: "The Ultimate Question",

		calculationDescription:
			"Calculating the Ultimate Question...",

		estimatedTime: "10,000,000 years",

		duration: 10000,
		maxProgress: 99.8,
		resultDelay: 1500,

		result: {
			title: "ERROR 404",
			description: "Earth not found.",
			details:
				"The planet Earth has been destroyed to make way for a hyperspace bypass.",
			buttonLabel: "OK",
		},
	},
} as const;

export default function DeepThoughtModal({
	isOpen,
	onClose,
}: Props) {
	const [question, setQuestion] = useState<Question | null>(null);
	const [stage, setStage] = useState<Stage>("selection");
	const [progress, setProgress] = useState(0);

	const reset = () => {
		setQuestion(null);
		setStage("selection");
		setProgress(0);
	};

	const startCalculation = (selectedQuestion: Question) => {
		setQuestion(selectedQuestion);
		setProgress(0);
		setStage("calculating");
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const handleBack = () => {
		reset();
	};

	useEffect(() => {
		if (!isOpen || stage !== "calculating" || !question) {
			return;
		}

		const config = QUESTION_CONFIG[question];

		const intervalTime = 75;
		const totalSteps = config.duration / intervalTime;

		let step = 0;
		let stallTimeout: ReturnType<typeof setTimeout> | null = null;

		const interval = setInterval(() => {
			step++;

			const progressRatio = step / totalSteps;
			const easedProgress =
				1 - Math.pow(1 - progressRatio, 3);
			const nextProgress = Math.min(
				easedProgress * config.maxProgress,
				config.maxProgress
			);
			setProgress(nextProgress);
			if (step >= totalSteps) {
				clearInterval(interval);
				setProgress(config.maxProgress);
				stallTimeout = setTimeout(() => {
					if (question === "ultimate") {
						playSound(sounds.alert);
					}
					setStage("result");
				}, config.resultDelay);
			}
		}, intervalTime);

		return () => {
			clearInterval(interval);
			if (stallTimeout) {
				clearTimeout(stallTimeout);
			}
		};
	}, [isOpen, stage, question]);

	const renderSelection = () => {
		const questions = Object.entries(QUESTION_CONFIG) as [
			Question,
			(typeof QUESTION_CONFIG)[Question]
		][];

		return (
			<>
				<div className={styles.heading}>
					DEEP THOUGHT
				</div>
				<p className={styles.description}>
					What would you like to calculate?
				</p>
				<div className={styles.questions}>
					{questions.map(([key, config]) => (
						<button
							key={key}
							className={styles.questionButton}
							onClick={() =>
								startCalculation(key)
							}
						>
							{config.buttonLabel}
						</button>
					))}
				</div>
			</>
		);
	};

	const renderCalculation = () => {
		if (!question) {
			return null;
		}

		const config = QUESTION_CONFIG[question];
		return (
			<div className={styles.calculating}>
				<div className={styles.heading}>
					DEEP THOUGHT IS CALCULATING...
				</div>
				<p className={styles.description}>
					{config.calculationDescription}
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
						{config.estimatedTime}
					</strong>
				</p>
			</div>
		);
	};

	const renderResult = () => {
	if (!question) {
		return null;
	}

	if (question === "answer") {
		const config = QUESTION_CONFIG.answer;

		return (
			<div className={styles.result}>
				<div className={styles.heading}>
					{config.result.title}
				</div>

				<p>{config.result.description}</p>

				<div className={styles.answer}>
					{config.result.answer}
				</div>

				<button
					className={styles.button}
					onClick={handleBack}
				>
					{config.result.buttonLabel}
				</button>
			</div>
		);
	}

	const config = QUESTION_CONFIG.ultimate;

	return (
		<div className={styles.error}>
			<div className={styles.errorTitle}>
				{config.result.title}
			</div>

			<p>{config.result.description}</p>

			<p>{config.result.details}</p>

			<button
				className={styles.button}
				onClick={handleBack}
			>
				{config.result.buttonLabel}
			</button>
		</div>
	);
};

	const renderContent = () => {
		switch (stage) {
			case "selection":
				return renderSelection();

			case "calculating":
				return renderCalculation();

			case "result":
				return renderResult();

			default:
				return null;
		}
	};

	return (
		<XPModal
			title="Deep Thought"
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