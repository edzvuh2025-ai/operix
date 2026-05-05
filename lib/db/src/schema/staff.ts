import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { groupsTable } from "./groups";

export const staffTable = pgTable("staff_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groupsTable.id, { onDelete: "cascade" }),
  robloxUsername: text("roblox_username").notNull(),
  robloxId: text("roblox_id"),
  rank: text("rank"),
  role: text("role").notNull().default("staff"),
  status: text("status").notNull().default("active"),
  totalActivityMinutes: integer("total_activity_minutes").notNull().default(0),
  sessionsCount: integer("sessions_count").notNull().default(0),
  warningsCount: integer("warnings_count").notNull().default(0),
  casesCount: integer("cases_count").notNull().default(0),
  avatarUrl: text("avatar_url"),
  lastSeenAt: timestamp("last_seen_at"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const insertStaffSchema = createInsertSchema(staffTable).omit({ id: true, joinedAt: true });
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staffTable.$inferSelect;
