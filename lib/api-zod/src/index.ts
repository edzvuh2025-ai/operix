import {z} from "zod";

export const CreateGroupSchema = z.object({name: z.string().min(1), robloxId: z.number().int().positive()});
export const CreateStaffSchema = z.object({robloxId: z.number(), username: z.string().min(1), role: z.string()});
export const CreateCaseSchema = z.object({targetRobloxId: z.number(), targetUsername: z.string(), reason: z.string().min(1), action: z.enum(["Warn", "Kick", "Ban"]), handledBy: z.string()});
export const CreateSessionSchema = z.object({staffRobloxId: z.number()});
export const UpdateSettingsSchema = z.object({description: z.string().optional(), discord: z.string().optional(), website: z.string().optional()});
