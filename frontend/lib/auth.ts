import { tokenStorage } from "./token";

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = tokenStorage.get();

  if (!token) return false;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    if (!payload.exp) return false;

    const isExpired = payload.exp * 1000 <= Date.now();

    if (isExpired) {
      tokenStorage.remove();
      return false;
    }

    return true;
  } catch {
    tokenStorage.remove();
    return false;
  }
};
