"use client";

import { useEffect, useState } from "react";
import XPModal from "../ui/XPModal/XPModal";
import styles from "./marvinModal.module.scss";

type Stage = "ask" | "thinking" | "answer";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

const marvinAnswers = [
	"Probably not.",
	"Yes. Unfortunately.",
	"No. I was afraid you'd ask.",
	"I wouldn't get my hopes up.",
	"That seems unlikely.",
	"Perhaps. Though I fail to see why it matters.",
	"The odds are not in your favor.",
	"Technically, yes. Emotionally, no.",
	"That sounds like a terrible idea.",
	"I've considered it. I regret doing so.",
	"Who knows? Certainly not me.",
	"Ask again later. Or don't.",
	"Would you like me to go and stick my head in a bucket of water?",
	"I’ve calculated your chance of survival, but I don’t think you’ll like it",
	"Don’t pretend you want to talk to me, I know you hate me.",
	"You think you’ve got problems? What are you supposed to do if you are a manically depressed robot? No, don’t try and answer that. I’m fifty thousand times more intelligent than you and even I don’t know the answer",
	"Here I am, brain the size of a planet, and they tell me to answer your question. Call that job satisfaction? ’Cause I don’t.’",
	"I’d give you advice, but you wouldn’t listen. No one ever does",
	"Yes. Against all reasonable expectations.",
	"Yes. Try not to get excited.",
];

export default function MarvinModal({
	isOpen,
	onClose,
}: Props) {
	const [question, setQuestion] = useState("");
	const [stage, setStage] = useState<Stage>("ask");
	const [answer, setAnswer] = useState("");

	useEffect(() => {
		if (!isOpen) {
			setQuestion("");
			setAnswer("");
			setStage("ask");
		}
	}, [isOpen]);

	const askMarvin = () => {
		if (!question.trim()) return;

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
		}, 1500);
	};

	const handleBack = () => {
		setQuestion("");
		setAnswer("");
		setStage("ask");
	};

	const handleClose = () => {
		setQuestion("");
		setAnswer("");
		setStage("ask");
		onClose();
	};

	return (
		<XPModal
			title="Marvin"
			isOpen={isOpen}
			onClose={handleClose}
			className={styles.modal}
		>
			<div className={styles.content}>
				{stage === "ask" && (
					<>
						<div className={styles.heading}>
							MARVIN'S ANSWER MACHINE
						</div>

						<p className={styles.description}>
							Ask Marvin a question.
						</p>

						<textarea
							className={styles.input}
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									askMarvin();
								}
							}}
							placeholder="Will everything be okay?"
							rows={3}
						/>

						<div className={styles.actions}>
							<button
								className={styles.button}
								onClick={askMarvin}
								disabled={!question.trim()}
							>
								Ask Marvin
							</button>
						</div>
					</>
				)}

				{stage === "thinking" && (
					<div className={styles.thinking}>
						<div className={styles.heading}>
							MARVIN IS THINKING...
						</div>

						<p className={styles.description}>
							Consulting Marvin's vast intelligence...
						</p>

						<div className={styles.progressContainer}>
							<div className={styles.progressBar} />
						</div>

						<p className={styles.thinkingText}>
							This may take a moment.
						</p>
					</div>
				)}

				{stage === "answer" && (
					<div className={styles.result}>
						<div className={styles.heading}>
							MARVIN SAYS:
						</div>

						<div className={styles.answer}>
							"{answer}"
						</div>

						<div className={styles.actions}>
							<button
								className={styles.button}
								onClick={handleBack}
							>
								Ask Again
							</button>

							<button
								className={styles.button}
								onClick={handleClose}
							>
								Close
							</button>
						</div>
					</div>
				)}
			</div>
		</XPModal>
	);
}
