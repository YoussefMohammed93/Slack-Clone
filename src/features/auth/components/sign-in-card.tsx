import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { SignInFlow } from "../types";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Log in to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-3">
          <Input
            disabled={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            type="password"
            required
          />
          <Button type="submit" size="lg" disabled={false} className="w-full">
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-3">
          <Button
            disabled={false}
            onChange={() => {}}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="absolute size-6 top-2 left-2.5" />
            Continue with Google
          </Button>
          <Button
            disabled={false}
            onChange={() => {}}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="absolute size-6 top-2 left-2.5" />
            Continue with Githhub
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?
          <span>
            <button
              onClick={() => setState("signUp")}
              className="text-sky-700 hover:underline ml-2"
            >
              Sign up
            </button>
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
