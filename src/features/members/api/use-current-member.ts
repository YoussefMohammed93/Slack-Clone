import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface UseCurrentMemberProps {
  workspaceId: Id<"workspaces">;
}

export const UseCurrentMember = ({ workspaceId }: UseCurrentMemberProps) => {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
