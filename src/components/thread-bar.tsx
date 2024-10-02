import { ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ThreadBarProps {
  name?: string;
  count?: number;
  image?: string;
  timeStamp?: number;
  onClick?: () => void;
}

export const ThreadBar = ({
  count,
  image,
  name = "Member",
  timeStamp,
  onClick,
}: ThreadBarProps) => {
  if (!count || !timeStamp) return null;

  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-start rounded-md hover:bg-white p-1 border border-transparent hover:border-border group/thread-bar transition-all max-w-[500px]"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 font-bold hover:underline truncate">
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="text-xs text-muted-foreground hover:underline truncate block group-hover/thread-bar:hidden">
          Last reply {formatDistanceToNow(timeStamp, { addSuffix: true })}
        </span>
        <span className="text-xs text-muted-foreground hover:underline truncate hidden group-hover/thread-bar:block">
          View thread
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition-all shrink-0" />
    </button>
  );
};
