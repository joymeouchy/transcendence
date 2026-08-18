"use client";

import DesktopLayout from "../components/DesktopLayout/DesktopLayout";
import XPWindow from "../components/ui/XPWindow/XPWindow";
import { useRouter } from "next/navigation";

import styles from "./page.module.scss";



export default function TermsOfService() {

  const router = useRouter();
  return (
    <DesktopLayout>
      <XPWindow
        title="Terms Of Service"
        onClose={() => router.push("/home")}

      >
        <div className={styles.content}>
          <h1>Terms of Service</h1>

          <p className={styles.updated}>
            Last updated: August 18, 2026
          </p>

          <h2>1. Acceptance of Terms</h2>

          <p>
            By accessing or using this website, you
            agree to be bound by these Terms of
            Service. If you do not agree with these
            terms, please do not use the website.
          </p>

          <h2>2. Accounts</h2>

          <p>
            Some features of the website require you
            to create an account. You are responsible
            for keeping your account information and
            credentials secure.
          </p>

          <p>
            You agree to provide accurate information
            when creating your account and not to
            impersonate another person or use another
            user's account.
          </p>

          <h2>3. Use of the Website</h2>

          <p>
            You agree to use the website only for
            lawful purposes and in a way that does not
            interfere with the experience or security
            of other users.
          </p>

          <p>You must not:</p>

          <ul>
            <li>
              Attempt to access another user's
              account.
            </li>
            <li>
              Attempt to bypass authentication or
              security mechanisms.
            </li>
            <li>
              Exploit vulnerabilities for malicious
              purposes.
            </li>
            <li>
              Upload malicious software or harmful
              content.
            </li>
            <li>
              Harass, threaten, or abuse other
              users.
            </li>
            <li>
              Interfere with the operation of the
              website.
            </li>
          </ul>

          <h2>4. Games and Matchmaking</h2>

          <p>
            The website provides online games and
            matchmaking features. Game results,
            scores, statistics, and match history may
            be associated with your account.
          </p>

          <p>
            We do not guarantee that matchmaking,
            games, rankings, or other game features
            will always be available or free from
            errors.
          </p>

          <h2>5. Friends and Chat</h2>

          <p>
            The website may provide social features
            such as friend requests, online status,
            game invitations, and chat.
          </p>

          <p>
            You are responsible for your interactions
            with other users and must not use these
            features to harass, threaten, or otherwise
            abuse other users.
          </p>

          <h2>6. User Content</h2>

          <p>
            You are responsible for content that you
            submit to the website, including profile
            information, profile images, and messages.
          </p>

          <h2>7. Customization</h2>

          <p>
            The website may allow you to customize
            your experience, including desktop
            wallpapers, colors, and other interface
            preferences.
          </p>

          <h2>8. Service Availability</h2>

          <p>
            We aim to keep the website available, but
            we cannot guarantee uninterrupted access.
            The service may be temporarily unavailable
            due to maintenance, technical problems,
            network issues, or other circumstances.
          </p>

          <h2>9. Account Suspension</h2>

          <p>
            We may restrict or terminate access to an
            account if we reasonably believe that the
            user has violated these Terms or used the
            website in a way that threatens its
            security or other users.
          </p>

          <h2>10. Intellectual Property</h2>

          <p>
            The website's software, design, graphics,
            and original content belong to their
            respective owners unless otherwise stated.
            You may not reproduce or redistribute
            proprietary content without permission.
          </p>

          <h2>11. Changes to These Terms</h2>

          <p>
            We may update these Terms from time to
            time. The date at the top of this document
            will be updated when changes are made.
          </p>

          <h2>12. Contact</h2>

          <p>
            If you have questions about these Terms of
            Service, please contact us on slack @jmeouchy or @rdennaou.
          </p>
        </div>
      </XPWindow>
    </DesktopLayout>
  );
}