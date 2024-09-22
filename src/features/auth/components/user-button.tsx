"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../api/user-current-user";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loader2 className="size-5 animate-spin text-white" />;
  }

  if (!data) {
    return null;
  }

  const { image, name } = data;

  const avatarFallback = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10">
          <AvatarImage
            src={image}
            alt={name}
            className="object-cover rounded-md"
          />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-32">
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
