"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import XPAlert from "@/app/components/ui/XPAlert/XPAlert";
import { alertManager } from "@/lib/alert";

interface AlertContextType {
  showAlert: (message: string) => void;
}

const AlertContext =
  createContext<AlertContextType | null>(null);

export function AlertProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    return alertManager.subscribe(
      (newMessage) => {
        setMessage(newMessage);
      }
    );
  }, []);

  return (
    <AlertContext.Provider
      value={{
        showAlert: setMessage,
      }}
    >
      {children}

      <XPAlert
        isOpen={message !== null}
        message={message ?? ""}
        onClose={() => setMessage(null)}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error(
      "useAlert must be used inside AlertProvider"
    );
  }

  return context;
}