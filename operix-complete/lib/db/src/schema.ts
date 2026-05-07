import {pgTable, text, serial, timestamp, integer, varchar, index} from "drizzle-orm/pg-core";

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", {length: 255}).notNull(),
  name: varchar("name", {length: 255}).notNull(),
  robloxId: integer("roblox_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}, {indexes: [index("user_id_idx").on(groups.userId)]});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groups.id, {onDelete: "cascade"}),
  robloxId: integer("roblox_id").notNull(),
  username: varchar("username", {length: 255}).notNull(),
  role: varchar("role", {length: 100}).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groups.id, {onDelete: "cascade"}),
  targetRobloxId: integer("target_roblox_id").notNull(),
  targetUsername: varchar("target_username", {length: 255}).notNull(),
  reason: text("reason").notNull(),
  action: varchar("action", {length: 50}).notNull(),
  handledBy: varchar("handled_by", {length: 255}).notNull(),
  status: varchar("status", {length: 50}).notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at")
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groups.id, {onDelete: "cascade"}),
  staffRobloxId: integer("staff_roblox_id").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at")
});

export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groups.id, {onDelete: "cascade"}),
  userId: varchar("user_id", {length: 255}).notNull(),
  action: varchar("action", {length: 100}).notNull(),
  resourceType: varchar("resource_type", {length: 50}).notNull(),
  resourceId: integer("resource_id"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
