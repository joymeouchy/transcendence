"use client";
import { useEffect, useState } from "react";
import XPModal from "../../../ui/XPModal/XPModal";
import {
  customizationService,
  CustomizationTheme,
} from "@/services/Customization.services";
import { gameThemes } from "@/app/data/game/gameCustomization";
import { API_URL } from "@/lib/api";
import "./CustomizationModal.scss";

type Props = {
  isOpen: boolean;
  onBack: () => void;
  onSave: (theme: CustomizationTheme) => void;
};

export default function CustomizationModal({ isOpen, onBack, onSave }: Props) {
  const [themes, setThemes] = useState<CustomizationTheme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const getAssetUrl = (path: string | null) => {
    if (!path) return "";

    if (path.startsWith("http")) return path;

    if (path.startsWith("/uploads")) return `${API_URL}${path}`;
    return path;
  };

  useEffect(() => {
    if (!isOpen) return;
    const loadThemes = async () => {
      try {
        setLoading(true);
        const available = await customizationService.getThemes();
        setThemes(available);
        const current = await customizationService.getMyTheme();
        setSelectedTheme(current.name);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadThemes();
  }, [isOpen]);
  const handleSave = async () => {
    if (!selectedTheme) return;
    try {
      setSaving(true);
      const updated = await customizationService.updateTheme(selectedTheme);
      const current = await customizationService.getMyTheme();
      onSave(updated);
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <XPModal
      title="Customize Pong"
      isOpen={isOpen}
      onClose={onBack}
      isLoading={loading || saving}
      loadingMessage={saving ? "Saving theme..." : "Loading themes..."}
    >
      <div className="customization">
        <div className="theme-list">
          {themes.map((theme) => {
            const background = getAssetUrl(
              theme.backgroundImageUrl ?? gameThemes.classic.background
            );
            const leftPaddle = getAssetUrl(
              theme.leftPaddleImageUrl ?? gameThemes.classic.leftPaddle
            );
            const rightPaddle = getAssetUrl(
              theme.rightPaddleImageUrl ?? gameThemes.classic.rightPaddle
            );
            const ball = getAssetUrl(
              theme.ballImageUrl ?? gameThemes.classic.ball
            );
            return (
              <button
                key={theme.id}
                className={`theme-card ${
                  selectedTheme === theme.name ? "selected" : ""
                }`}
                onClick={() => setSelectedTheme(theme.name)}
                disabled={saving}
              >
                <div className="theme-preview">
                  <img
                    className="preview-background"
                    src={background}
                    alt="background"
                  />
                  <img
                    className="preview-paddle left"
                    src={leftPaddle}
                    alt="left paddle"
                  />
                  <img
                    className="preview-paddle right"
                    src={rightPaddle}
                    alt="right paddle"
                  />
                  <img className="preview-ball" src={ball} alt="ball" />
                </div>
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
        <div className="customization_actions">
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onBack} disabled={saving}>
            Cancel
          </button>
        </div>
      </div>
    </XPModal>
  );
}
