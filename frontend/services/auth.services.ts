// // import { api } from "@/lib/api";
// import type { RegisterDto, LoginDto, AuthResponse } from "../types/auth.dto";

// export const authService = {
//   register: async (data: RegisterDto): Promise<AuthResponse> => {
//     const res = await api.post("/auth/register", data);
//     return res.data;
//   },

//   login: async (data: LoginDto): Promise<AuthResponse> => {
//     const res = await api.post("/auth/login", data);

//     // ⚠️ store token here (if using JWT in frontend)
//     if (res.data.token) {
//       localStorage.setItem("token", res.data.token);
//     }

//     return res.data;
//   },

//   logout: () => {
//     localStorage.removeItem("token");
//   },

//   getToken: () => {
//     return localStorage.getItem("token");
//   },
// };
