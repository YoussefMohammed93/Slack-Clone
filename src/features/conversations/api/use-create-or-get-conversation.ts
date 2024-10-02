import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  memberId: Id<"members">;
  workspaceId: Id<"workspaces">;
};

type ResponsetType = Id<"conversations"> | null;

type Options = {
  onSuccess?: (data: ResponsetType) => void;
  onError?: (err: Error) => void;
  onSettled?: () => void;
  throwErr?: boolean;
};

export const UseCreateOrGetConversation = () => {
  const [data, setData] = useState<ResponsetType>(null);
  const [err, setErr] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "success" | "err" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isErr = useMemo(() => status === "err", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.conversations.createOrGet);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setErr(null);
        setData(null);
        setStatus("pending");

        const response = await mutation(values);
        setData(response);
        setStatus("success");
        options?.onSuccess?.(response);
      } catch (err) {
        setErr(err as Error);
        setStatus("err");
        options?.onError?.(err as Error);

        if (options?.throwErr) {
          throw err;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    mutate,
    data,
    err,
    isPending,
    isSuccess,
    isErr,
    isSettled,
  };
};
