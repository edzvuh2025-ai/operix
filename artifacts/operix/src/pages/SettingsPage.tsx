import { useState, useEffect } from "react";
import { GroupProvider, useGroupContext } from "@/lib/group-context";
import { MainLayout } from "@/components/layout/main-layout";
import { useUpdateGroup, useCreateGroup, getListGroupsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Save, Layers } from "lucide-react";

const FADE_UP = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function SettingsContent() {
  const { activeGroup, groups } = useGroupContext();
  const groupId = activeGroup?.id ?? 0;
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [robloxGroupId, setRobloxGroupId] = useState("");
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupRobloxId, setNewGroupRobloxId] = useState("");

  useEffect(() => {
    if (activeGroup) {
      setName(activeGroup.name ?? "");
      setRobloxGroupId(activeGroup.robloxGroupId ?? "");
      setDescription(activeGroup.description ?? "");
    }
  }, [activeGroup]);

  const updateGroup = useUpdateGroup();
  const createGroup = useCreateGroup();

  const handleSave = () => {
    updateGroup.mutate({ groupId, data: { name, description } }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListGroupsQueryKey() }); setSaved(true); setTimeout(() => setSaved(false), 2000); },
    });
  };

  const handleAddGroup = () => {
    if (!newGroupName) return;
    createGroup.mutate({ data: { name: newGroupName, robloxGroupId: newGroupRobloxId || undefined } }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListGroupsQueryKey() }); setNewGroupName(""); setNewGroupRobloxId(""); },
    });
  };

  return (
    <motion.div variants={STAGGER} initial="hidden" animate="show" className="space-y-8 max-w-2xl">
      <motion.div variants={FADE_UP}>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your group configuration</p>
      </motion.div>

      <motion.div variants={FADE_UP}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Group Details</CardTitle>
            <CardDescription>Update your group's information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium mb-1.5 block">Group Name</label><Input value={name} onChange={e => setName(e.target.value)} placeholder="My Roblox Group" /></div>
            <div><label className="text-sm font-medium mb-1.5 block">Roblox Group ID</label><Input value={robloxGroupId} onChange={e => setRobloxGroupId(e.target.value)} placeholder="e.g. 12345678" /></div>
            <div><label className="text-sm font-medium mb-1.5 block">Description</label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A short description of your group" className="resize-none" rows={3} /></div>
            <Button onClick={handleSave} disabled={updateGroup.isPending || !name} className="gap-2">
              <Save className="h-4 w-4" />
              {saved ? "Saved!" : updateGroup.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Separator />

      <motion.div variants={FADE_UP}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4" /> Add Another Group</CardTitle>
            <CardDescription>Manage multiple Roblox groups from one workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium mb-1.5 block">Group Name</label><Input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Group Name" /></div>
              <div><label className="text-sm font-medium mb-1.5 block">Roblox Group ID</label><Input value={newGroupRobloxId} onChange={e => setNewGroupRobloxId(e.target.value)} placeholder="Optional" /></div>
            </div>
            <Button variant="outline" onClick={handleAddGroup} disabled={createGroup.isPending || !newGroupName} className="gap-2">
              <Plus className="h-4 w-4" />{createGroup.isPending ? "Adding..." : "Add Group"}
            </Button>
            {groups.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-xs text-muted-foreground font-medium mb-2">Your Groups</p>
                {groups.map(g => (
                  <div key={g.id} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${g.id === activeGroup?.id ? "bg-primary/10 text-primary" : "bg-muted/20"}`}>
                    <div className="h-5 w-5 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{g.name.charAt(0)}</div>
                    <span>{g.name}</span>
                    {g.id === activeGroup?.id && <span className="ml-auto text-xs text-primary">Active</span>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={FADE_UP}>
        <Card className="border-border/50 opacity-60">
          <CardHeader>
            <CardTitle className="text-base">Integrations</CardTitle>
            <CardDescription>Connect Roblox APIs, Discord webhooks, and more — coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Integration options will be available in a future update.</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default function SettingsPage() {
  return <GroupProvider><MainLayout><SettingsContent /></MainLayout></GroupProvider>;
}
