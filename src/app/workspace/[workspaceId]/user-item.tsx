import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userItemVariants = cva(
  "flex items-center justify-start overflow-hidden text-sm font-normal h-8 px-4 my-[2px]",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481249] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface UsetItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({
  id,
  label = "Member",
  image,
  variant,
}: UsetItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();

  return (
    <Button
      variant="transparent"
      size="sm"
      asChild
      className={cn(userItemVariants({ variant: variant }))}
    >
      <Link
        href={`/workspace/${workspaceId}/member/${id}`}
        className="relative"
      >
        <Avatar className="rounded-md">
          <AvatarImage
            className="size-6 mt-[7px] rounded-md object-cover"
            src={image}
          />
          <AvatarFallback className="size-6 mt-[7px] rounded-md bg-sky-500 text-white text-xs">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="absolute left-12 text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
