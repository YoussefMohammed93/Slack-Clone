import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetMessage } from "../api/use-get-message";
import { useGetMessages } from "../api/use-get-messages";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader2, XIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { UseCreateMessage } from "../api/use-create-message";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { UseCurrentMember } from "@/features/members/api/use-current-member";
import { UseGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValues = {
  body: string;
  image?: Id<"_storage">;
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
};

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "EEE, MMMM d");
};

const TIME_THRESHOLD = 5;

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const { mutate: createMessage } = UseCreateMessage();
  const { mutate: generateUploadUrl } = UseGenerateUploadUrl();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { data: currentMember } = UseCurrentMember({ workspaceId });

  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const handelSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        channelId,
        workspaceId,
        image: undefined,
        parentMessageId: messageId,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwErr: true });

        if (!url || typeof url !== "string") {
          console.error("Failed to generate upload URL");
          throw new Error("Failed to generate upload URL");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          console.error("Failed to upload image", result);
          throw new Error("Failed to upload image");
        }

        const response = await result.json();
        console.log("Upload response:", response);

        if (!response.storageId) {
          console.error("Missing storageId in response", response);
          throw new Error("Missing storageId in upload response");
        }

        values.image = response.storageId;
      }

      await createMessage(values, { throwErr: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to send message:", err);
        toast.error(err.message || "Failed to send message!");
      } else {
        console.error("Unknown error:", err);
        toast.error("Failed to send message!");
      }
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, message) => {
      if (message?._creationTime) {
        const date = new Date(message._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");

        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }

        groups[dateKey].unshift(message);
      }

      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-[60px] px-5 border-b">
          <p className="text-lg font-semibold">Thread</p>
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

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-[60px] px-5 border-b">
          <p className="text-lg font-semibold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center h-full">
          <AlertTriangle className="size-5 text-destructive" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between h-[60px] px-5 border-b">
        <p className="text-lg font-semibold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="messages-scrollbar flex flex-1 flex-col-reverse overflow-y-auto">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="relative text-center my-3">
              <hr className="absolute top-1/2 left-0 right-0 border-t bg-gray-300" />
              <span className="relative inline-block px-4 py-1 rounded-full shadow-sm text-xs border border-gray-300 bg-white">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            <div>
              {messages.map((message, index) => {
                const prevMsg = messages[index - 1];
                const isCompact =
                  prevMsg &&
                  prevMsg.user?._id === message?.user?._id &&
                  prevMsg._creationTime &&
                  differenceInMinutes(
                    new Date(message._creationTime!),
                    new Date(prevMsg._creationTime)
                  ) < TIME_THRESHOLD;

                return (
                  <Message
                    isAuthor={message?.memberId === currentMember?._id}
                    isEditing={editingId === message?._id}
                    isCompact={!!isCompact}
                    hideThreadButton
                    setEditingId={setEditingId}
                    id={message!._id}
                    key={message?._id}
                    body={message?.body ?? ""}
                    image={message?.image}
                    memberId={message?.memberId}
                    reactions={message?.reactions ?? []}
                    updatedAt={message?.updatedAt}
                    authorName={message?.user.name}
                    authorImage={message?.user.image}
                    createdAt={message?._creationTime}
                    threadCount={message?.threadCount}
                    threadImage={message?.threadImage}
                    threadName={message?.threadName}
                    threadTimestamp={message?.threadTimestamp}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );
              observer.observe(el);
              return observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="relative text-center my-3">
            <hr className="absolute top-1/2 left-0 right-0 border-t bg-gray-300" />
            <span className="relative inline-block px-4 py-1 rounded-full shadow-sm text-xs border border-gray-300 bg-white">
              <Loader2 className="size-4 animate-spin" />
            </span>
          </div>
        )}
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
      <div className="px-5 pb-8">
        <Editor
          key={editorKey}
          innerRef={editorRef}
          disabled={isPending}
          placeholder="Reply..."
          onSubmit={handelSubmit}
        />
      </div>
    </div>
  );
};
