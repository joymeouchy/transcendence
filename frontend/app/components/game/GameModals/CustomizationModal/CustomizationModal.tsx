"use client";
import { useEffect, useState } from "react";
import XPModal from "../../../ui/XPModal/XPModal";
import {
  customizationService,
  CustomizationTheme,
} from "@/services/Customization.services";
import { gameThemes } from "@/app/data/game/gameCustomization";
import { API_URL } from "@/lib/api";
import clsx from "clsx";
import "./CustomizationModal.scss";

const paddleClass = "absolute top-1/2 h-12.5 w-3 -translate-y-1/2 object-contain";

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
      <div className="flex h-auto max-h-[75vh] min-h-0 flex-col gap-2.5">
        <div className="grid max-h-80 min-h-0 flex-initial grid-cols-2 content-start items-start gap-2.5 overflow-x-hidden overflow-y-auto pt-1 pr-2 pb-1 pl-1 [@media(max-height:700px)]:max-h-60">
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
                className={clsx(
                  "game-theme-card flex h-auto cursor-pointer flex-col items-center justify-start gap-2 self-start rounded-xp-lg bg-transparent p-2.5 text-xp-black",
                  selectedTheme === theme.name && "selected",
                )}
                onClick={() => setSelectedTheme(theme.name)}
                disabled={saving}
              >
                <div className="relative aspect-22/13 h-auto w-45 max-w-full shrink-0 overflow-hidden rounded-xp-md bg-xp-black [@media(max-height:700px)]:w-37.5">
                  <img
                    className="absolute inset-0 size-full object-cover"
                    src={background}
                    alt="background"
                  />
                  <img
                    className={clsx(paddleClass, "left-3.75")}
                    src={leftPaddle}
                    alt="left paddle"
                  />
                  <img
                    className={clsx(paddleClass, "right-3.75")}
                    src={rightPaddle}
                    alt="right paddle"
                  />
                  <img className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 object-contain" src={ball} alt="ball" />
                </div>
                <span className="font-bold text-xp-black">{theme.name}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-1.5 flex shrink-0 justify-end gap-2.5">
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
