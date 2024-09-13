import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "@/components/ui/button";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

const SidebarButton = ({ icon: Icon, label, isActive }: SidebarButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      <Button
        variant="transparent"
        className={cn(
          "size-9 p-2 group-hover:bg-accent/20 mt-2",
          isActive && "bg-accent/20"
        )}
      >
        <Icon className="size-5 group-hover:scale-125 duration-200 transition-all text-white" />
      </Button>
      <span className="text-[11px] group-hover:text-accent text-white">
        {label}
      </span>
    </div>
  );
};

export default SidebarButton;
