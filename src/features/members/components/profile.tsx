import {
  AlertTriangle,
  ChevronDownIcon,
  Loader2,
  LogOut,
  MailIcon,
  XIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { UseGetMember } from "../api/use-get-member";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { UseRemoveMember } from "../api/use-remove-member";
import { UseUpdateMember } from "../api/use-update-member";
import { Id } from "../../../../convex/_generated/dataModel";
import { UseCurrentMember } from "../api/use-current-member";
import { DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [UpdateDialog, ConfirmUpdateDialog] = useConfirm(
    "Change role",
    "Are you sure you want to change this member's role?"
  );

  const [LeaveDialog, ConfirmLeaveDialog] = useConfirm(
    "Leave workspace",
    "Are you sure you want to leave this workspace?"
  );

  const [RemoveDialog, ConfirmRemoveDialog] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member?"
  );

  const { data: member, isLoading: isLoadingMember } = UseGetMember({
    id: memberId,
  });

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    UseCurrentMember({
      workspaceId,
    });

  const { mutate: updateMember, isPending: isUpdatingMember } =
    UseUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    UseRemoveMember();

  const onRemove = async () => {
    const ok = await ConfirmRemoveDialog();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Member removed successfully!");
          onClose();
        },
        onError: (err) => {
          toast.error("Failed to remove member!");
          console.log(err);
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await ConfirmLeaveDialog();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("You left this workspace!");
          onClose();
        },
        onError: () => {
          toast.error("Failed to leave this workspace!");
        },
      }
    );
  };

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await ConfirmUpdateDialog();

    if (!ok) return;

    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Role changed successfully!");
          onClose();
        },
        onError: () => {
          toast.error("Failed to change role!");
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-[60px] px-5 border-b">
          <p className="text-lg font-semibold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-[60px] px-5 border-b">
          <p className="text-lg font-semibold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center h-full">
          <AlertTriangle className="size-5 text-destructive" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const avatarFallback = member.user.name?.[0] ?? "M";

  return (
    <>
      <LeaveDialog />
      <RemoveDialog />
      <UpdateDialog />
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-[60px] px-5 border-b">
          <p className="text-lg font-semibold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[250px] max-h-[250px] size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="aspect-square text-6xl font-black">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold mb-3">{member.user.name}</p>
          {currentMember?.role === "admin" && currentMember._id !== memberId ? (
            <div className="flex items-center gap-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full capitalize"
                    disabled={isUpdatingMember}
                  >
                    {isUpdatingMember ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        {member.role}{" "}
                        <ChevronDownIcon className="size-4 ml-2" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem
                      value="admin"
                      className={`cursor-pointer rounded-md px-2 py-1 m-0.5 text-center ${
                        member.role === "admin"
                          ? "bg-blue-500 text-white"
                          : "text-black"
                      }`}
                    >
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="member"
                      className={`cursor-pointer rounded-md px-2 py-1 text-center m-0.5 ${
                        member.role === "member"
                          ? "bg-blue-500 text-white"
                          : "text-black"
                      }`}
                    >
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={onRemove}
                className="w-full"
                disabled={isRemovingMember}
              >
                {isRemovingMember ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Remove"
                )}
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember.role !== "admin" ? (
            <div className="mt-3">
              <Button
                onClick={onLeave}
                variant="outline"
                className="w-full"
                disabled={isRemovingMember}
              >
                {isRemovingMember ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    Leave <LogOut className="size-4 ml-2 mt-0.5" />
                  </>
                )}
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-x-2">
            <div className="flex items-center justify-center bg-muted size-11 rounded-md">
              <MailIcon className="size-6" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm text-[#1264a3] hover:underline"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
