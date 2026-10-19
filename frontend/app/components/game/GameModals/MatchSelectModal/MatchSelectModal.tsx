"use client";

import XPModal from "../../../ui/XPModal/XPModal";
import RulesModal from "../RulesModal/RulesModal";
import LegalModal from "../LegalModal/LegalModal";
import { images } from "@/lib/images";

import { useState } from "react";

import "./MatchSelectModal.scss";

type Props = {
  isOpen: boolean;
  onBack: () => void;
  onStartOnline: () => void;
  onPlayFriend: () => void;
  onCustomize: () => void;
  onReturnHome: () => void;
};

export default function MatchSelectModal({
  isOpen,
  onBack,
  onStartOnline,
  onPlayFriend,
  onCustomize,
  onReturnHome,
}: Props) {
  const [showRules, setShowRules] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  return (
    <>
      <XPModal
        closeOnOverlayClick={false}
        title="Play Pong"
        isOpen={isOpen}
        onClose={onBack}
        headerButton={
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Show game rules"
              title="Show game rules"
              className="xp-header-icon-btn flex size-7 cursor-pointer items-center justify-center border-none bg-transparent p-0"
              onClick={() => setShowRules(true)}
            >
              <img
                src= {images.gameInfo}
                alt=""
                className="size-5 object-contain"
              />
            </button>

            <button
              type="button"
              aria-label="Legal and privacy"
              title="Legal & Privacy"
              className="xp-header-icon-btn flex size-7 cursor-pointer items-center justify-center border-none bg-transparent p-0"
              onClick={() => setShowLegal(true)}
            >
              <img
                src= {images.legalInfo}
                alt=""
                className="size-12 object-contain"
              />
            </button>
          </div>
        }
      >
        <div className="flex w-[min(90vw,420px)] flex-col items-center gap-3.75 text-center max-[450px]:w-[90vw]">
          <div className="match-select__header">
            <p>Welcome to Pong!</p>

            <span>Choose a game mode to start playing.</span>
          </div>

          <div className="flex w-full flex-row items-center justify-center gap-2 max-[450px]:flex-col">
            <button onClick={onStartOnline}>🎮 Play Online</button>

            <button onClick={onPlayFriend}>👥 Play Friend</button>

            <button onClick={onCustomize}>🎨 Customize Game</button>
          </div>

          <div className="return-button">
            <button onClick={onReturnHome}>🏠 Return to Homepage</button>
          </div>
        </div>
      </XPModal>

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <LegalModal isOpen={showLegal} onClose={() => setShowLegal(false)} />
    </>
  );
}
