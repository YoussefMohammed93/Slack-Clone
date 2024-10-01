"use client";

import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader2, TriangleAlert } from "lucide-react";
import { MessageList } from "@/components/message-list";
import { useGetChannel } from "@/features/channels/use-get-channel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-1 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex flex-col gap-2 flex-1 items-center justify-center">
        <TriangleAlert className="size-5 text-destructive" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Header title={channel.name} />
      <MessageList
        data={results}
        loadMore={loadMore}
        channelName={channel.name}
        canLoadMore={status === "CanLoadMore"}
        isLoadingMore={status === "LoadingMore"}
        channelCreationTime={channel._creationTime.toString()}
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
