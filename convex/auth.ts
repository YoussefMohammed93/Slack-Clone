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

const GITHUB = GitHub({
  clientId: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  authorization: {
    params: {
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
    },
  },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GITHUB, CustomPassword],
});
