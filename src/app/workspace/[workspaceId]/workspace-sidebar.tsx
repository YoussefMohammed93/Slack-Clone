import { UserItem } from "./user-item";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceHeader } from "./workspace-header";
import { useChannelId } from "@/hooks/use-channel-id";
import { WorkspaceSection } from "./workspace-section";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, HashIcon, Loader2 } from "lucide-react";
import { useGetChannels } from "@/features/channels/use-get-channels";
import { UseGetMembers } from "@/features/members/api/use-get-members";
import { UseCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-wokspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = UseCurrentMember({
    workspaceId,
  });

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { data: channels } = useGetChannels({
    workspaceId,
  });

  const { data: members } = UseGetMembers({
    workspaceId,
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
      <WorkspaceSection
        label={`Channels of ${workspace.name} workspace`}
        hint="New channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label={`Members of ${workspace.name} workspace`}
        hint="New direct message"
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={member._id}
            label={item.user.name}
            image={item.user.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
