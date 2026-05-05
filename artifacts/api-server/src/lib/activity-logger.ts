import { activityTable } from "@workspace/db";
import { sql } from "drizzle-orm";

export async function logActivity(
  db: any,
  groupId: number,
  userId: string,
  action: string,
  details: Record<string, any> = {}
) {
  try {
    await db.insert(activityTable).values({
      groupId,
      userId,
      action,
      details,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
