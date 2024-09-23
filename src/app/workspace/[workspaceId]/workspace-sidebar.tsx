import { SidebarItem } from "./sidebar-item";
import { WorkspaceHeader } from "./workspace-header";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { UseCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-wokspace";
import {
  AlertTriangle,
  HashIcon,
  Loader2,
  MessageSquareText,
  SendHorizontal,
} from "lucide-react";
import { UserItem } from "./user-item";
import { WorkspaceSection } from "./workspace-section";
import { useGetChannels } from "@/features/channels/use-get-channel";
import { UseGetMembers } from "@/features/members/api/use-get-members";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

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
      <div className="flex flex-col mt-3 px-2">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sents" icon={SendHorizontal} id="drafts" />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        onNew={() => {}}
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
