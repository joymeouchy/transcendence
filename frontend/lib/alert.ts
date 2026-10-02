type AlertListener = (message: string) => void;

let listener: AlertListener | null = null;

export const alertManager = {
  subscribe(newListener: AlertListener) {
    listener = newListener;

    return () => {
      listener = null;
    };
  },

  show(message: string) {
    listener?.(message);
  },
};