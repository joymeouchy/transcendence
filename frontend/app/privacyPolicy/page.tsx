"use client";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import XPWindow from "../components/ui/XPWindow/XPWindow";

import styles from "./page.module.scss";

import { useRouter } from "next/navigation";



export default function PrivacyPolicy() {
	const router = useRouter();
	return (
		<DesktopLayout>
			<XPWindow
				title="Privacy Policy"
				onClose={() => router.push("/home")}
			>
				<div className={styles.content}>
					<h1>Privacy Policy</h1>

					<p className={styles.updated}>
						Last updated: August 18, 2026
					</p>

					<p>
						This Privacy Policy explains how we
						collect, use, and protect information when
						you use this website and its services.
					</p>

					<h2>1. Information We Collect</h2>

					<p>
						Depending on how you use the website, we
						may collect information associated with
						your account and your use of the platform.
					</p>

					<h3>Account Information</h3>

					<p>
						When you create an account, we may collect:
					</p>

					<ul>
						<li>Username</li>
						<li>Email address</li>
						<li>Profile picture or avatar</li>
						<li>Authentication information</li>
						<li>Account preferences</li>
					</ul>

					<h3>Game Information</h3>

					<p>
						When you play games on the platform, we
						may collect information related to your
						gameplay, including:
					</p>

					<ul>
						<li>Matches played</li>
						<li>Wins and losses</li>
						<li>Match results</li>
						<li>Scores</li>
						<li>Game statistics</li>
						<li>Match history</li>
					</ul>

					<h3>Social Features</h3>

					<p>
						If you use social features, we may process
						information related to:
					</p>

					<ul>
						<li>Friend requests</li>
						<li>Friend relationships</li>
						<li>Online status</li>
						<li>Chat messages</li>
						<li>Game invitations</li>
					</ul>

					<h3>Customization Information</h3>

					<p>
						If you customize your experience, we may
						store preferences such as:
					</p>

					<ul>
						<li>Desktop wallpaper</li>
						<li>Color scheme</li>
						<li>Interface preferences</li>
						<li>Game theme</li>
					</ul>

					<h3>Technical Information</h3>

					<p>
						Certain technical information may be
						processed automatically when you use the
						website, depending on the application's
						infrastructure.
					</p>

					<ul>
						<li>Browser information</li>
						<li>Device information</li>
						<li>IP address</li>
						<li>Connection information</li>
						<li>Authentication and session information</li>
						<li>Error and diagnostic information</li>
					</ul>

					<h2>2. How We Use Your Information</h2>

					<p>
						We use collected information to operate
						and improve the website and its services,
						including to:
					</p>

					<ul>
						<li>Manage user accounts</li>
						<li>Authenticate users</li>
						<li>Provide access to games</li>
						<li>Maintain game statistics</li>
						<li>Provide match history and leaderboards</li>
						<li>Provide friend and social features</li>
						<li>Provide chat functionality</li>
						<li>Save user preferences</li>
						<li>Improve the website and user experience</li>
						<li>Diagnose technical problems</li>
						<li>Prevent misuse of the platform</li>
					</ul>

					<h2>3. Authentication</h2>

					<p>
						The website may support authentication
						through third-party providers such as
						Google.
					</p>

					<p>
						When using a third-party authentication
						provider, that provider may process your
						information according to its own privacy
						policy and terms.
					</p>

					<h2>4. Chat and User Content</h2>

					<p>
						The website may allow users to communicate
						through chat and other social features.
						Messages and other submitted content may
						be processed or stored to provide these
						features.
					</p>

					<p>
						Users should avoid sharing sensitive
						personal information through public or
						social areas of the website.
					</p>

					<h2>5. Cookies and Local Storage</h2>

					<p>
						The website may use cookies, local storage,
						or similar browser technologies to support
						application functionality.
					</p>

					<p>These technologies may be used to:</p>

					<ul>
						<li>Maintain authentication sessions</li>
						<li>Store user preferences</li>
						<li>Remember customization settings</li>
						<li>Support website functionality</li>
					</ul>

					<h2>6. Data Sharing</h2>

					<p>
						We do not sell your personal information.
					</p>

					<p>
						Information may be shared with third-party
						services when necessary to operate the
						website, such as authentication, hosting,
						database, or storage providers.
					</p>

					<p>
						We may also disclose information when
						required by law or when necessary to
						protect the security or integrity of the
						website and its users.
					</p>

					<h2>7. Data Security</h2>

					<p>
						We take reasonable measures to protect
						information processed through the website.
						However, no website or method of transmitting
						information over the internet can be
						guaranteed to be completely secure.
					</p>

					<h2>8. Data Retention</h2>

					<p>
						We retain information for as long as
						reasonably necessary to provide the
						services and maintain the functionality of
						the platform.
					</p>

					<p>
						Account information, game statistics,
						friendships, and other information may
						remain associated with an account until the
						account is deleted or the information is
						otherwise removed.
					</p>

					<h2>9. Your Rights</h2>

					<p>
						Depending on applicable law, you may have
						rights regarding your personal information,
						including the right to:
					</p>

					<ul>
						<li>Request access to your information</li>
						<li>Request correction of inaccurate information</li>
						<li>Request deletion of your information</li>
						<li>Ask how your information is processed</li>
						<li>Withdraw consent where applicable</li>
					</ul>

					<p>
						To make a request, contact us on slack
						@jmeouchy or @rdennaou.
					</p>

					<h2>10. Children's Privacy</h2>

					<p>
						The website is not intended to knowingly
						collect personal information from children
						in violation of applicable laws.
					</p>

					<h2>11. Changes to This Privacy Policy</h2>

					<p>
						We may update this Privacy Policy from
						time to time. When changes are made, the
						"Last updated" date at the top of this
						policy will be updated.
					</p>

					<h2>12. Contact</h2>

					<p>
						If you have questions or concerns regarding
						this Privacy Policy or the handling of your
						information, please contact us on slack
						@jmeouchy or @rdennaou.
					</p>
				</div>
			</XPWindow>
		</DesktopLayout>
	);
}