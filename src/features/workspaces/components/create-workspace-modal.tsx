import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import React, { useState, useCallback } from "react";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UseCreateWorkspace } from "../api/use-create-workspace";

export const CreateWorkspaceModal = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isPending } = UseCreateWorkspace();

  const handleClose = useCallback(() => {
    setOpen(false);
    setName("");
  }, [setOpen]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      mutate(
        { name },
        {
          onSuccess(id) {
            toast.success("Workspace created");
            router.push(`/wokspace/${id}`);
            handleClose();
          },
        }
      );
    },
    [name, mutate, router, handleClose]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    []
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={handleNameChange}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div>
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
