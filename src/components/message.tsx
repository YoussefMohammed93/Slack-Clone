import { Hint } from "./hint";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Toolbar } from "./toolbar";
import { Thumbnail } from "./thumbnail";
import { Reactions } from "./reactions";
import { useConfirm } from "@/hooks/use-confirm";
import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { UseRemoveMessage } from "@/features/messages/api/use-remove-message";
import { UseUpdateMessage } from "@/features/messages/api/use-update-message";
import { UseToggleReaction } from "@/features/reactions/api/use-toggle-reaction";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  isAuthor: boolean;
  isEditing: boolean;
  authorName?: string;
  isCompact?: boolean;
  authorImage?: string;
  threadCount?: number;
  threadImage?: string;
  memberId: Id<"members"> | undefined;
  threadTimestamp?: number;
  hideThreadButton?: boolean;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["updatedAt"];
  updatedAt: Doc<"messages">["_creationTime"] | undefined;
  setEditingId: (id: Id<"messages"> | null) => void;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
  id,
  isAuthor,
  // memberId,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  // threadCount,
  // threadImage,
  // threadTimestamp,
}: MessageProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Message",
    "Are you sure you want to delete this message? This cannot be undone."
  );

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    UseUpdateMessage();

  const { mutate: removeMessage, isPending: isRemovingMessage } =
    UseRemoveMessage();

  const { mutate: toggleReaction } = UseToggleReaction();

  const isPending = isUpdatingMessage;

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Failed to toggle reaction");
        },
      }
    );
  };

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated successfully!");
          setEditingId(null);
        },
        onError: () => {
          toast.success("Failed to update Message!");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted successfully!");

          // TODO : Close thread if opened
        },
        onError: () => {
          toast.success("Failed to delete message!");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "relative flex flex-col gap-2 py-2 px-5 hover:bg-gray-100/60 group",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "bg-red-500/80 transform transition-all scale-y-0 origin-bottom duration-500"
          )}
        >
          <div className="flex items-center gap-2">
            <Hint label={formatFullTime(new Date(createdAt || Date.now()))}>
              <button className="w-10 leading-[22px] text-center hover:underline text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {format(new Date(createdAt || Date.now()), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="w-full flex flex-col">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isPending={isPending}
              isAuthor={isAuthor}
              handleThread={() => {}}
              handleDelete={handleRemove}
              handleEdit={() => setEditingId(id)}
              hideThreadButton={hideThreadButton}
              handleReaction={handleReaction}
            />
          )}
        </div>
      </>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "relative flex flex-col gap-2 py-2 px-5 hover:bg-gray-100/60 group",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-red-500/80 transform transition-all scale-y-0 origin-bottom duration-500"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarImage className="mt-1" src={authorImage} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="w-full flex flex-col overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => {}}
                  className="text-primary hover:underline font-bold"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt || Date.now()))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt || Date.now()), "h:mm a")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isPending={isPending}
            isAuthor={isAuthor}
            handleThread={() => {}}
            handleDelete={handleRemove}
            handleEdit={() => setEditingId(id)}
            hideThreadButton={hideThreadButton}
            handleReaction={handleReaction}
          />
        )}
      </div>
    </>
  );
};
