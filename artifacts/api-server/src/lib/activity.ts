import {client, activityLog} from "@operix/db";

export async function logActivity(groupId: number, userId: string, action: string, resourceType: string, resourceId?: number, details?: string) {
  await client.insert(activityLog).values({groupId, userId, action, resourceType, resourceId, details});
}
