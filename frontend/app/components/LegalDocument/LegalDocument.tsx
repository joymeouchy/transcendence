import clsx from "clsx";
import styles from "./LegalDocument.module.scss";

type LegalDocumentProps = {
	title: string;
	updated: string;
	children: React.ReactNode;
};

// White document body for the Privacy Policy / Terms of Service windows.
export default function LegalDocument({ title, updated, children }: LegalDocumentProps) {
	return (
		<div className={clsx(styles.document, "w-full bg-xp-white p-4 font-xp text-xp-base leading-normal text-xp-black")}>
			<h1>{title}</h1>

			<p className={styles.updated}>
				{updated}
			</p>

			{children}
		</div>
	);
}
