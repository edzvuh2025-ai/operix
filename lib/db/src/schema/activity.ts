import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { groupsTable } from "./groups";

export const activityTable = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groupsTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  message: text("message").notNull(),
  staffUsername: text("staff_username"),
  referenceId: integer("reference_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groupsTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull().default("info"),
  staffId: integer("staff_id"),
  staffUsername: text("staff_username"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiInsightsTable = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groupsTable.id, { onDelete: "cascade" }),
  staffId: integer("staff_id"),
  staffUsername: text("staff_username"),
  type: text("type").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull().default("info"),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activityTable).omit({ id: true, createdAt: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type ActivityItem = typeof activityTable.$inferSelect;

export const insertAlertSchema = createInsertSchema(alertsTable).omit({ id: true, createdAt: true });
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alertsTable.$inferSelect;

export const insertAiInsightSchema = createInsertSchema(aiInsightsTable).omit({ id: true, createdAt: true });
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type AiInsight = typeof aiInsightsTable.$inferSelect;
