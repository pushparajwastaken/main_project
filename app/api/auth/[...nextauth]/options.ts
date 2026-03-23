import { NextAuthOptions } from "next-auth";
import CredentialProviders from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProviders({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "lavanya@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              {
                username: credentials.identifier,
              },
            ],
          }).select("+password");
          if (!user) {
            throw new Error("No user found with this email or username");
          }
          if (!user.emailVerified) {
            throw new Error("Please verify your email first");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); //this user is from next-auth and it doesn't have ._id so
        //updated the user in the types/next-auth.d.ts
        token.emailVerified = !!user?.emailVerified;
        token.username = user?.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.emailVerified = token.emailVerified;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
