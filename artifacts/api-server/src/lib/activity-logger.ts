import { db, activityTable } from "@workspace/db";

export type ActivityType = 
  | "staff_added"
  | "staff_updated"
  | "staff_deleted"
  | "case_created"
  | "case_updated"
  | "case_closed"
  | "session_started"
  | "session_ended"
  | "rule_created"
  | "rule_updated"
  | "rule_deleted";

interface LogActivityParams {
  groupId: number;
  type: ActivityType;
  message: string;
  staffUsername?: string | null;
  referenceId?: number;
}

/**
 * Log an activity event to the activity_log table.
 * Use this after key mutations (staff added, case created, session ended, etc.)
 */
export async function logActivity({
  groupId,
  type,
  message,
  staffUsername = null,
  referenceId,
}: LogActivityParams): Promise<void> {
  try {
    await db.insert(activityTable).values({
      groupId,
      type,
      message,
      staffUsername,
      referenceId,
    });
  } catch (err) {
    // Log but don't fail the request if activity logging fails
    console.error("[ActivityLogger] Failed to log activity:", { groupId, type, err });
  }
}
