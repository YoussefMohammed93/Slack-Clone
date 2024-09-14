import { WorkspaceHeader } from "./workspace-header";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { UseCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-wokspace";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberLoading } = UseCurrentMember({
    workspaceId,
  });

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex items-center justify-center flex-col h-full bg-[#5E2C5F]">
        <Loader2 className="w-5 h-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex items-center justify-center flex-col gap-y-2 h-full bg-[#5E2C5F]">
        <AlertTriangle className="w-5 h-5 text-white" />
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#5E2C5F]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
    </div>
  );
};
