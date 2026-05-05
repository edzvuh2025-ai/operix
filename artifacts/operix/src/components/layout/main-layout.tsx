import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { useGroupContext } from "@/lib/group-context";

export function MainLayout({ children }: { children: ReactNode }) {
  const { isLoading, groups } = useGroupContext();

  return (
    <div className="min-h-[100dvh] bg-background">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-[100dvh]">
        <main className="flex-1 p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">Loading workspace...</p>
              </div>
            </div>
          ) : groups.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="max-w-md text-center">
                <h2 className="text-2xl font-bold mb-2">Welcome to Operix</h2>
                <p className="text-muted-foreground mb-6">Create your first group to get started.</p>
                {/* We will add group creation UI here later if needed */}
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
