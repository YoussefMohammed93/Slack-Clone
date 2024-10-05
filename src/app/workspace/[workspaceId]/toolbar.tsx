import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-wokspace";
import { useGetChannels } from "@/features/channels/use-get-channels";
import Link from "next/link";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  const { data: channels } = useGetChannels({ workspaceId });

  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between h-14 p-1.5 bg-[#480350]">
      <div className="flex-1" />
      <div className="max-[640px] min-w-[280px] grow-[2] shrink">
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          className="w-full h-7 px-2 justify-start bg-accent/25 hover:bg-accent/25"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-xs text-white">Search {data?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem key={channel._id} asChild>
                  <Link
                    href={`/workspace/${workspaceId}/channel/${channel._id}`}
                    onClick={() => setOpen(false)}
                  >
                    {channel.name}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="flex-1" />
    </nav>
  );
};
