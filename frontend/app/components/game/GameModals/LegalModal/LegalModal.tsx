"use client";

import XPModal from "../../../ui/XPModal/XPModal";
import {
  privacyPolicyItem,
  termsOfServicesItem,
} from "@/app/data/navigationItems/navigationItemsFields";

import { useRouter } from "next/navigation";

import Link from "next/link";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LegalModal({ isOpen, onClose }: Props) {
  const items = [privacyPolicyItem, termsOfServicesItem];
  const router = useRouter();

  return (
    <XPModal closeOnOverlayClick={false} title="Legal & Privacy" isOpen={isOpen} onClose={onClose}>
      <div className="flex w-[min(90vw,360px)] flex-col items-center gap-4 p-4 text-center max-[450px]:w-full max-[450px]:p-xp-xs">
        <p>
          Review our policies to learn how your information is handled and the
          rules for using Pong.
        </p>

        <div className="flex w-full flex-col gap-3">
          {items.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => {
                onClose();
                router.push(item.href);
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded border border-gray-400 bg-gray-200 px-4 py-2 text-black shadow-[inset_1px_1px_white,inset_-1px_-1px_#808080] hover:bg-gray-300 active:shadow-inner"
            >
              <img src={item.image} alt="" className="size-8 object-contain" />

              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </XPModal>
  );
}
