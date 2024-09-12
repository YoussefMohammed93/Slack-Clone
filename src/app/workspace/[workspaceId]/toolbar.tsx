import { Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-wokspace";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return (
    <nav className="flex items-center justify-between h-10 p-1.5 bg-[#480350]">
      <div className="flex-1" />
      <div className="max-[640px] min-w-[280px] grow-[2] shrink">
        <Button
          size="sm"
          className="w-full h-7 px-2 justify-start bg-accent/25 hover:bg-accent/25"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-xs text-white">Search {data?.name}</span>
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-end ml-auto">
        <Button size="iconSm" variant="transparent">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
