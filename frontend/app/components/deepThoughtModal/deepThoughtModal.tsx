"use client";

import { useEffect, useState } from "react";
import XPModal from "../ui/XPModal/XPModal";
import { playSound, sounds } from "@/lib/sounds";
import clsx from "clsx";
import styles from "./deepThoughtModal.module.scss";

const headingClass = "mb-xp-md text-center text-xp-2xl font-bold";
const buttonClass = clsx(styles.button, "mt-xp-lg min-w-20 px-4.5 py-1.25 font-xp text-xp-base");
const errorTextClass = "text-xp-md leading-normal";

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
				<div className={headingClass}>
					DEEP THOUGHT
				</div>
				<p className="mb-xp-lg text-center text-xp-md">
					What would you like to calculate?
				</p>
				<div className="flex flex-col gap-xp-md">
					{questions.map(([key, config]) => (
						<button
							key={key}
							className={clsx(styles.questionButton, "w-full rounded-xp-2xs px-3 py-2.5 text-left font-xp text-xp-base")}
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
			<div className="text-center">
				<div className={headingClass}>
					DEEP THOUGHT IS CALCULATING...
				</div>
				<p className="mb-xp-lg text-center text-xp-md">
					{config.calculationDescription}
				</p>
				<div className="mt-xp-lg h-5 w-full border border-xp-gray-500 bg-xp-white p-0.5">
					<div
						className="h-full bg-xp-highlight transition-[width] duration-75 ease-linear"
						style={{
							width: `${progress}%`,
						}}
					/>
				</div>

				<div className="mt-2 font-['Courier_New',monospace] text-xp-md">
					{progress.toFixed(1)}%
				</div>

				<p className="mt-xp-lg text-xp-base leading-normal">
					Estimated calculation time:
					<br />
					<strong className="text-xp-md">
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
			<div className="text-center">
				<div className={headingClass}>
					{config.result.title}
				</div>

				<p>{config.result.description}</p>

				<div className="mx-0 my-5 text-[64px] font-bold text-xp-classic-navy">
					{config.result.answer}
				</div>

				<button
					type="button"
					className={buttonClass}
					onClick={handleBack}
				>
					{config.result.buttonLabel}
				</button>
			</div>
		);
	}

	const config = QUESTION_CONFIG.ultimate;

	return (
		<div className="text-center">
			<div className="mb-xp-md text-xp-3xl font-bold text-xp-error-dark">
				{config.result.title}
			</div>

			<p className={errorTextClass}>{config.result.description}</p>

			<p className={errorTextClass}>{config.result.details}</p>

			<button
				type="button"
				className={buttonClass}
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
		>
			{/* width lives on the content so XPWindow's own max-width keeps the frame snug on phones */}
			<div className="w-98 max-w-full p-xp-lg font-xp text-xp-black max-[450px]:p-xp-sm">
				{renderContent()}
			</div>
		</XPModal>
	);
}