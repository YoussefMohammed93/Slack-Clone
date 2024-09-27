import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { UseCreateMessage } from "@/features/messages/api/use-create-message";
import { UseGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  body: string;
  image?: Id<"_storage">;
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const editorRef = useRef<Quill | null>(null);

  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const { mutate: createMessage } = UseCreateMessage();
  const { mutate: generateUploadUrl } = UseGenerateUploadUrl();

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
