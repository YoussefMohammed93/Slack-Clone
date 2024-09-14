import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hint } from "@/components/hint";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: WorkspaceHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 h-[50px] gap-0.5">
      <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="transparent"
            className="w-auto overflow-hidden text-lg font-semibold p-1.5"
          >
            <span className="truncate">{workspace.name}</span>
            <ChevronDown
              className={`size-5 shrink-0 ml-1 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-56">
          <DropdownMenuItem className="capitalize w-56">
            <div className="flex items-center justify-center mr-2 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl shrink-0 rounded-md size-9">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start overflow-hidden w-full">
              <p className="font-bold truncate">{workspace.name}</p>
              <p className="text-xs to-muted-foreground whitespace-nowrap">
                Active Workspace
              </p>
            </div>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2" onClick={() => {}}>
                Invite people to {workspace.name}
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2" onClick={() => {}}>
                Perferences
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-1">
        <Hint label="Filter conversations" side="bottom">
          <Button variant="transparent" size="iconSm">
            <ListFilter className="size-5" />
          </Button>
        </Hint>
        <Hint label="New message" side="bottom">
          <Button variant="transparent" size="iconSm">
            <SquarePen className="size-5" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
