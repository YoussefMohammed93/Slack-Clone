import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { UseNewJoinCode } from "@/features/workspaces/api/use-new-join-code";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one."
  );

  const { mutate, isPending } = UseNewJoinCode();

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Invite code regenerted");
        },
        onError: () => {
          toast.error("Failed to regenerate invite code");
        },
      }
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied successfully"));
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to your {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-y-4 py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button onClick={handleCopy} variant="ghost" size="default">
              Copy link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="w-full flex items-center justify-between">
            <Button
              onClick={handleNewCode}
              disabled={isPending}
              variant="outline"
            >
              New code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
