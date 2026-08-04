"use client";

import XPModal from "../../../ui/XPModal/XPModal";
import RulesModal from "../RulesModal/RulesModal";

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

  return (
    <>
      <XPModal
        title="Play Pong"
        isOpen={isOpen}
        onClose={onBack}
        headerButton={
          <button
            className="xp-header-icon-btn"
            onClick={() => setShowRules(true)}
          >
            <img
              src="/info_icon.png"
              alt="Rules"
            />
          </button>
        }
      >
        <div className="match-select">

          <div className="match-select__header">
            <p>
              Welcome to Pong!
            </p>

            <span>
              Choose a game mode to start playing.
            </span>
          </div>


          <div className="mode-buttons">

            <button onClick={onStartOnline}>
              🎮 Play Online
            </button>


            <button onClick={onPlayFriend}>
              👥 Play Friend
            </button>


            <button onClick={onCustomize}>
              🎨 Customize Game
            </button>

          </div>


          <div className="return-button">

            <button onClick={onReturnHome}>
              🏠 Return to Homepage
            </button>

          </div>

        </div>
      </XPModal>


      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
    </>
  );
}