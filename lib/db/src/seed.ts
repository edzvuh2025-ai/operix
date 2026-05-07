import { client, groups, staff, cases, activityLog } from "./index.js";

async function seed() {
  const [g] = await client.insert(groups).values({ userId: "demo-user", name: "Demo Group", robloxId: 123456 }).returning();
  await client.insert(staff).values({ groupId: g.id, robloxId: 101, username: "DemoMod1", role: "Moderator" });
  await client.insert(staff).values({ groupId: g.id, robloxId: 102, username: "DemoAdmin", role: "Admin" });
  const [c1] = await client.insert(cases).values({ groupId: g.id, targetRobloxId: 999, targetUsername: "BadUser1", reason: "Spam", action: "Warn", handledBy: "DemoMod1", status: "open" }).returning();
  await client.insert(activityLog).values([
    { groupId: g.id, userId: "demo-user", action: "create", resourceType: "group", resourceId: g.id, details: "Created demo group" },
    { groupId: g.id, userId: "demo-user", action: "create", resourceType: "case", resourceId: c1.id, details: "Created moderation case" }
  ]);
  console.log("✓ Seed complete");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
