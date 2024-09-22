import { cn } from "@/lib/utils";
import { useToggle } from "react-use";
import { PlusIcon } from "lucide-react";
import { Hint } from "@/components/hint";
import { FaCaretDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface WorkspaceSectionProps {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
}

export const WorkspaceSection = ({
  children,
  label,
  hint,
  onNew,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center justify-between px-3.5 group">
        <div className="flex items-center">
          <Button
            variant="transparent"
            className="text-sm shrink-0 size-6 text-[#f9edffcc] p-0.5"
            onClick={toggle}
          >
            <FaCaretDown className={cn("size-4 transition-transform", on && "-rotate-180")} />
          </Button>
          <Button
            variant="transparent"
            size="sm"
            className="group px-1.5 text-[#f9edffcc] h-[28px] items-center justify-start overflow-hidden"
          >
            <span className="truncate">{label}</span>
          </Button>
        </div>
        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              size="iconSm"
              variant="transparent"
              className="opacity-0 group-hover:opacity-100 transition-opacity size-6 shrink-0 p-0.5 text-sm text-[#f9edffcc]"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
};
