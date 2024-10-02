import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { FaChevronDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { UseUpdateChannel } from "@/features/channels/use-update-channel";
import { UseRemoveChannel } from "@/features/channels/use-remove-channel";
import { UseCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this channel?",
    "You are about to delete this channel. This action is irreversible"
  );
  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);

  const { data: member } = UseCurrentMember({ workspaceId });

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    UseUpdateChannel();

  const { mutate: removeChannel, isPending: isRemovingChannel } =
    UseRemoveChannel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLocaleLowerCase();
    setValue(value);
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted successfully.");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete this channel!");
          router.push(`/workspace/${workspaceId}`);
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel name updated successfully!");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel name");
        },
      }
    );
  };

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;

    setEditOpen(value);
  };

  return (
    <div className="h-[60px] flex items-center overflow-hidden px-3 border-b bg-white">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="text-lg font-semibold overflow-hidden w-auto"
            variant="ghost"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden p-0 bg-gray-100">
          <DialogHeader className="border-b p-4 bg-white">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div
                  className={`py-4 px-5 rounded-lg border bg-white border-gray-200 transition-all duration-200 ${
                    member?.role === "admin"
                      ? "cursor-pointer hover:bg-gray-100"
                      : "cursor-default"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#1264a3] font-semibold hover:underline">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    minLength={3}
                    maxLength={80}
                    value={value}
                    disabled={isUpdatingChannel}
                    required
                    autoFocus
                    onChange={handleChange}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingChannel}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                onClick={handleDelete}
                disabled={isRemovingChannel}
                className="flex items-center gap-x-2 px-5 py-4 rounded-lg border text-destructive border-gray-200 transition-all duration-200 hover:bg-gray-100 bg-white"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
