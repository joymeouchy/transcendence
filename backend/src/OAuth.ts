import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AuthProvider, PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatarUrl = profile.photos?.[0]?.value;

        if (!email) return done(new Error("No email from Google"));

        // check if user already exists
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // create new user
          user = await prisma.user.create({
            data: {
              username: profile.displayName,
              email,
              avatarUrl: avatarUrl ?? null,
              oauthId: profile.id,
              provider: AuthProvider.google,
            },
          });
        } else if (user.provider !== AuthProvider.google) {
          // user exists but registered with email/password
          return done(
            new Error(
              "This email is already registered. Please log in with your password.",
            ),
          );
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export default passport;
