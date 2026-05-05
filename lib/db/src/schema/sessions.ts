import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { groupsTable } from "./groups";
import { staffTable } from "./staff";

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groupsTable.id, { onDelete: "cascade" }),
  staffId: integer("staff_id").references(() => staffTable.id, { onDelete: "set null" }),
  staffUsername: text("staff_username"),
  serverName: text("server_name"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  durationMinutes: integer("duration_minutes").default(0),
  active: boolean("active").notNull().default(true),
  actionsCount: integer("actions_count").notNull().default(0),
});

export const insertSessionSchema = createInsertSchema(sessionsTable).omit({ id: true, startedAt: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionsTable.$inferSelect;
