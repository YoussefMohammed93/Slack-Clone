import GitHub from "@auth/core/providers/github";
import { DataModel } from "./_generated/dataModel";
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
      role: params.role as string,
    };
  },
});

const isProd = process.env.NODE_ENV === "production";
const callbackUrl = isProd
  ? "https://slack-clone-matrix.vercel.app/api/auth/callback/github"
  : "http://localhost:3000/api/auth/callback/github";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          redirect_uri: callbackUrl,
        },
      },
    }),
    CustomPassword,
  ],
});
