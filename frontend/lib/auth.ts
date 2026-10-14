
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    if (!payload.exp) return false;

    const isExpired = payload.exp * 1000 <= Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
};
