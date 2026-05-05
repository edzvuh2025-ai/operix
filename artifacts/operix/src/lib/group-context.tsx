import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useListGroups } from "@workspace/api-client-react";
import type { Group } from "@workspace/api-client-react";

interface GroupContextType {
  activeGroup: Group | null;
  setActiveGroupId: (id: number) => void;
  groups: Group[];
  isLoading: boolean;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const { data: groups = [], isLoading } = useListGroups();
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);

  useEffect(() => {
    if (groups.length > 0 && activeGroupId === null) {
      setActiveGroupId(groups[0].id);
    }
  }, [groups, activeGroupId]);

  const activeGroup = groups.find(g => g.id === activeGroupId) || (groups.length > 0 ? groups[0] : null);

  return (
    <GroupContext.Provider value={{ activeGroup, setActiveGroupId, groups, isLoading }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroupContext() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroupContext must be used within a GroupProvider");
  }
  return context;
}
