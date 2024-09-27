import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { UseCreateMessage } from "@/features/messages/api/use-create-message";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const editorRef = useRef<Quill | null>(null);

  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const { mutate: createMessage } = UseCreateMessage();

  const handelSubmit = async ({
    body,
    // image, // TODO : Image upload feature
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);

      await createMessage(
        {
          body,
          channelId,
          workspaceId,
        },
        { throwErr: true }
      );

      setEditorKey((prevKey) => prevKey + 1);
    } catch (err) {
      toast.error("Failed to send message!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full px-4">
      <Editor
        key={editorKey}
        variant="create"
        placeholder={placeholder}
        onSubmit={handelSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};
