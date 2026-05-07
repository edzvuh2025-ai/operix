export interface Group {
  id: string;
  userId: string;
  name: string;
  robloxId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: number;
  groupId: number;
  robloxId: number;
  username: string;
  role: string;
  joinedAt: string;
  createdAt: string;
}

export interface Case {
  id: number;
  groupId: number;
  targetRobloxId: number;
  targetUsername: string;
  reason: string;
  action: string;
  handledBy: string;
  status: string;
  createdAt: string;
  closedAt?: string;
}

export interface Session {
  id: number;
  groupId: number;
  staffRobloxId: number;
  startedAt: string;
  endedAt?: string;
}

export interface Activity {
  id: number;
  groupId: number;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: number;
  details?: string;
  createdAt: string;
}
