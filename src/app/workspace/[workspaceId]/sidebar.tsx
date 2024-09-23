import SidebarButton from "./sidebar-button";
import { usePathname } from "next/navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { UserButton } from "@/features/auth/components/user-button";
import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex items-center flex-col gapy-4 w-[70px] h-full pt-[9px] pb-4 bg-[#480350]">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton icon={MessageSquare} label="DMs" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={MoreHorizontal} label="More" />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
