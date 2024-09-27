import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";

type ResponsetType = string | null;

type Options = {
  onSuccess?: (data: ResponsetType) => void;
  onError?: (err: Error) => void;
  onSettled?: () => void;
  throwErr?: boolean;
};

export const UseGenerateUploadUrl = () => {
  const [data, setData] = useState<ResponsetType>(null);
  const [err, setErr] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "success" | "err" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isErr = useMemo(() => status === "err", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.upload.generateUplaodUrl);

  const mutate = useCallback(
    async (_values: unknown, options?: Options) => {
      try {
        setErr(null);
        setData(null);
        setStatus("pending");

        const response = await mutation();
        setData(response);
        setStatus("success");
        options?.onSuccess?.(response);
        return response;
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
