import { api } from "@/lib/api";

import { UserProfile } from "@/types/types.dto";

export interface UserSearchResult {
  id: number;
  username: string;
  avatarUrl: string | null;
  isOnline: boolean;
}

export interface UpdateUsernameResponse {
  message: string;
  username: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}

export const UserService = {
  /**
   * Get authenticated user
   */
  async getMe(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>(
      "/users/me"
    );

    return data;
  },

  /**
   * Get user profile by id
   */
  async getById(id: number): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>(
      `/users/${id}`
    );

    return data;
  },

  /**
   * Search users
   */
  async search(
    query: string
  ): Promise<UserSearchResult[]> {
    const { data } =
      await api.get<UserSearchResult[]>(
        "/users/search",
        {
          params: {
            q: query,
          },
        }
      );

    return data;
  },

  /**
   * Update username
   */
  async updateUsername(
    username: string
  ): Promise<UpdateUsernameResponse> {
    const { data } =
      await api.patch<UpdateUsernameResponse>(
        "/users/username",
        {
          username,
        }
      );

    return data;
  },

  /**
   * Upload profile picture
   */
  async uploadAvatar(
    file: File
  ): Promise<UploadAvatarResponse> {
    const formData = new FormData();

    formData.append(
      "avatar",
      file
    );

    const { data } =
      await api.post<UploadAvatarResponse>(
        "/users/me/avatar",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return data;
  },
};