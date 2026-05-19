export type RegisterDto = {
  username: string;
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  token?: string;
  userId: string;
};

type FormData = {
  email: string;
  password: string;
  username: string;
};

export type AuthField = {
  key: keyof FormData;
  label: string;
  placeholder: string;
  type: string;
  required?: boolean;
};
