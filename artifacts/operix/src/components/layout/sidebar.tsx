import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGroupContext } from "@/lib/group-context";
import { useUser, useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  ShieldAlert, 
  Workflow, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronsUpDown,
  Plus
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff", label: "Staff", icon: Users },
  { href: "/sessions", label: "Sessions", icon: Clock },
  { href: "/cases", label: "Cases", icon: ShieldAlert },
  { href: "/automation", label: "Automation", icon: Workflow },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { activeGroup, groups, setActiveGroupId } = useGroupContext();

  return (
    <div className="w-64 border-r bg-sidebar h-[100dvh] flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 mb-6">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Operix" className="h-6" />
        </Link>

        {activeGroup && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-sidebar hover:bg-sidebar-accent border-sidebar-border h-12">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {activeGroup.name.charAt(0)}
                  </div>
                  <span className="truncate text-sm font-medium">{activeGroup.name}</span>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[224px]">
              <DropdownMenuLabel>Your Groups</DropdownMenuLabel>
              {groups.map(group => (
                <DropdownMenuItem 
                  key={group.id} 
                  onClick={() => setActiveGroupId(group.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                    {group.name.charAt(0)}
                  </div>
                  <span className="truncate">{group.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href || location.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer text-sm font-medium ${
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}>
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate leading-none">{user?.fullName || "User"}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[224px]">
            <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
