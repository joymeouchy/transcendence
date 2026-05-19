import { AuthField } from "../../../types/auth.dto";

export const emailField: AuthField = {
  key: "email",
  label: "Email",
  placeholder: "example@example.com",
  type: "email",
  required: true,
};

export const passwordField: AuthField = {
  key: "password",
  label: "Password",
  placeholder: "Password",
  type: "password",
  required: true,
};

export const usernameField: AuthField = {
  key: "username",
  label: "Username",
  placeholder: "Username",
  type: "text",
  required: true,
};

export const confirmPasswordField = {
  key: "confirmPassword",
  label: "Confirm Password",
  placeholder: "Password",
  type: "password",
  required: true,
};