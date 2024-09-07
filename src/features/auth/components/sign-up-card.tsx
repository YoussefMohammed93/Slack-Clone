import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { SignInFlow } from "../types";
import { FaGithub } from "react-icons/fa";
import { TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthActions } from "@convex-dev/auth/react";
import LoadingButton from "@/components/ui/loading-button";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);

  const onPsswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErr("Passwords does not match");
      return;
    }

    setPending(true);
    signIn("password", { email, password, flow: "signUp" })
      .catch(() => {
        setErr("Something went wrong");
      })
      .finally(() => {
        setPending(false);
      });
  };

  const onProviderSignUp = (value: "github") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!err && (
        <div className="flex items-center gap-x-2 rounded-md text-sm text-destructive mb-5 bg-destructive/15 p-3">
          <TriangleAlert className="size-5 mr-1" />
          <p className="mt-1">{err}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPsswordSignUp} className="space-y-3">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            type="password"
            required
          />
          <LoadingButton
            type="submit"
            size="lg"
            loading={pending}
            disabled={pending}
            className="w-full"
          >
            Sign up
          </LoadingButton>
        </form>
        <Separator />
        <div>
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp("github")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="absolute size-6 top-2 left-2.5" />
            Sign up with GitHub
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Already have an account?
          <span>
            <button
              onClick={() => setState("signIn")}
              className="text-sky-700 hover:underline ml-2"
            >
              Log in
            </button>
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
