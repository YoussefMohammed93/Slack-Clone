import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-wokspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-wokspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateWorkspaceModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  const filterWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative overflow-hidden size-9 text-xl font-semibold bg-[#ABABAB] hover:bg-[#ABABAD]/80 text-black">
          {workspaceLoading ? (
            <Loader2 className="size-5 animate-spin shrink-0 " />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-56">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className=" flex-col justify-start items-start capitalize font-bold"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground font-semibold">
            Active workspace
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {filterWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="overflow-hidden capitalize"
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className="flex items-center justify-center relative overflow-hidden shrink-0 size-9 mr-2 rounded-md text-lg font-semibold text-white bg-[#606060]">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{workspace.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <div className="flex items-center justify-center relative overflow-hidden size-9 mr-2 rounded-md text-lg font-semibold text-black bg-[#DDD]">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
