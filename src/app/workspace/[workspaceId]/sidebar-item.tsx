import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cva, type VariantProps } from "class-variance-authority";

const sidebarItemVariants = cva(
  "flex items-center justify-start gap-1.5 overflow-hidden text-sm font-normal h-8 px-[18px] my-[2px]",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#f9edffcc] bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

export const SidebarItem = ({
  label,
  id,
  icon: Icon,
  variant,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      className={cn(sidebarItemVariants({ variant }))}
      asChild
      variant="transparent"
      size="sm"
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-5 mr-1 shrink-0" />
        <span className="text-sm font-medium truncate">{label}</span>
      </Link>
    </Button>
  );
};
