export type SignUpRequest = {
  email: string;
  username: string;
  password: string;
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  userId: number;
  profileUrl?: string | null;
}

export type DecodedToken = {
  nickname: string;
  userId: number;
  iat: number;
  exp: number;
};

declare global {
  namespace Express {
    interface User {
      userId: number;
      username: string;
      password?: string | null;
      profileUrl?: string | null;
      kakaoLoggedInToken?: string | null;
      googleLoggedInToken?: string | null;
    }
  }
}
