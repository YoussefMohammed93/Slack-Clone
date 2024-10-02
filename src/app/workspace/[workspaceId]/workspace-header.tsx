import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { InviteModal } from "./invite-modal";
import { Button } from "@/components/ui/button";
import { PreferencesModal } from "./preferences-modal";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Doc } from "../../../../convex/_generated/dataModel";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: WorkspaceHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />
      <div className="flex items-center justify-between px-4 h-[60px] gap-0.5 border-b border-gray-300">
        <WorkspaceSwitcher />
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
              <div className="flex items-center justify-center mr-2 relative overflow-hidden bg-[#333] text-white font-semibold text-xl shrink-0 rounded-md size-9">
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
                <DropdownMenuItem
                  className="py-2"
                  onClick={() => setInviteOpen(true)}
                >
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="py-2"
                  onClick={() => setPreferencesOpen(true)}
                >
                  Perferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
