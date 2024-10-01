import { useState } from "react";
import { Message } from "./message";
import { Loader2 } from "lucide-react";
import { ChannelHero } from "./channel-hero";
import { Id } from "../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { UseCurrentMember } from "@/features/members/api/use-current-member";
import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  loadMore: () => void;
  canLoadMore: boolean;
  isLoadingMore: boolean;
  channelCreationTime?: string;
  data: GetMessagesReturnType | undefined;
  variant?: "channel" | "thread" | "conversation";
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "EEE, MMMM d");
};

export const MessageList = ({
  channelName,
  loadMore,
  canLoadMore,
  isLoadingMore,
  channelCreationTime,
  data,
  variant = "channel",
}: MessageListProps) => {
  const workspaceId = useWorkspaceId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { data: currentMember } = UseCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce(
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
    {} as Record<string, typeof data>
  );

  console.log("MessageList - channelCreationTime:", channelCreationTime);

  return (
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
                  hideThreadButton={variant === "thread"}
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
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero
          name={channelName}
          creationTime={Number(channelCreationTime)}
        />
      )}
    </div>
  );
};
