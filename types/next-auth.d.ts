import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    emailVerified?: boolean;
    username?: string;
    role?: string;
  }
  interface Session {
    user: {
      _id?: string;
      emailVerified?: boolean;
      username?: string;
      role?: string;
    } & DefaultSession["user"]; //in default session there will always be a key named 'User'
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    emailVerified?: boolean;
    username?: string;
    role?: string;
  }
}
