// client-side copy of the backend rules (backend/src/helpers/auth_helpers.ts
// and backend/routes/messages.ts). the backend still checks everything, this
// only shows the error before the request is sent. keep both in sync.
// each validator returns an error message, or null if the value is valid.

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 2000;

export const validatePassword = (password: string): string | null => {
  if (password.length === 0) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  // max is 72 bytes because bcrypt silently ignores anything after that
  if (new TextEncoder().encode(password).length > 72) {
    return "Password must be at most 72 characters";
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number";
  }
  return null;
};

// expects the email already trimmed
export const validateEmail = (email: string): string | null => {
  if (email.length === 0) {
    return "Email is required";
  }
  if (email.length > 254) {
    return "Email is too long";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email address";
  }
  return null;
};

// expects the username already trimmed
export const validateUsername = (username: string): string | null => {
  if (username.length === 0) {
    return "Username is required";
  }
  if (
    username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH
  ) {
    return `Username must be ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters`;
  }
  return null;
};
