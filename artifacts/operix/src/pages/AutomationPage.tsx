import { useState } from "react";
import { GroupProvider, useGroupContext } from "@/lib/group-context";
import { MainLayout } from "@/components/layout/main-layout";
import { useListAutomationRules, useCreateAutomationRule, useUpdateAutomationRule, useDeleteAutomationRule, getListAutomationRulesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Zap, ArrowRight, Play } from "lucide-react";

const TRIGGER_LABELS: Record<string, string> = {
  session_duration: "Session Duration (min)",
  inactivity_days: "Inactivity (days)",
  case_count: "Case Count",
  punishment_count: "Punishment Count",
};

const ACTION_LABELS: Record<string, string> = {
  flag_staff: "Flag Staff Member",
  create_case: "Auto-Create Case",
  notify: "Send Notification",
  promote: "Promote Staff",
  demote: "Demote Staff",
};

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const FADE_UP = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

function NewRuleDialog({ groupId, onClose }: { groupId: number; onClose: () => void }) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("inactivity_days");
  const [triggerValue, setTriggerValue] = useState("7");
  const [action, setAction] = useState("flag_staff");
  const [actionDetails, setActionDetails] = useState("");
  const qc = useQueryClient();
  const create = useCreateAutomationRule();

  const handleSubmit = () => {
    if (!name || !triggerValue) return;
    create.mutate({ groupId, data: { name, trigger: trigger as any, triggerValue: parseFloat(triggerValue), action: action as any, actionDetails } }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListAutomationRulesQueryKey(groupId) }); onClose(); },
    });
  };

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Create Automation Rule</DialogTitle></DialogHeader>
      <div className="space-y-4 py-2">
        <div><label className="text-sm font-medium mb-1.5 block">Rule Name</label><Input placeholder="e.g. Flag Inactive Staff" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm font-medium mb-1.5 block">Trigger</label>
            <Select value={trigger} onValueChange={setTrigger}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(TRIGGER_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><label className="text-sm font-medium mb-1.5 block">Threshold</label><Input type="number" value={triggerValue} onChange={e => setTriggerValue(e.target.value)} /></div>
        </div>
        <div><label className="text-sm font-medium mb-1.5 block">Action</label>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.entries(ACTION_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><label className="text-sm font-medium mb-1.5 block">Action Details (optional)</label><Input placeholder="e.g. Reason for action" value={actionDetails} onChange={e => setActionDetails(e.target.value)} /></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={create.isPending || !name}>{create.isPending ? "Creating..." : "Create Rule"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function AutomationContent() {
  const { activeGroup } = useGroupContext();
  const groupId = activeGroup?.id ?? 0;
  const [newOpen, setNewOpen] = useState(false);
  const qc = useQueryClient();

  const { data: rules = [], isLoading } = useListAutomationRules(groupId, {
    query: { enabled: !!groupId, queryKey: getListAutomationRulesQueryKey(groupId) }
  });

  const updateRule = useUpdateAutomationRule();
  const deleteRule = useDeleteAutomationRule();

  const handleToggle = (ruleId: number, enabled: boolean) => {
    updateRule.mutate({ groupId, ruleId, data: { enabled } }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListAutomationRulesQueryKey(groupId) }),
    });
  };

  const handleDelete = (ruleId: number) => {
    deleteRule.mutate({ groupId, ruleId }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListAutomationRulesQueryKey(groupId) }),
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Automation Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">{rules.filter(r => r.enabled).length} active rules</p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> New Rule</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>
      ) : rules.length === 0 ? (
        <div className="text-center py-16">
          <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="font-medium text-muted-foreground">No automation rules yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first rule to automate staff management.</p>
          <Button onClick={() => setNewOpen(true)} className="mt-6 gap-2"><Plus className="h-4 w-4" /> Create First Rule</Button>
        </div>
      ) : (
        <motion.div variants={STAGGER} initial="hidden" animate="show" className="space-y-3">
          {rules.map(rule => (
            <motion.div key={rule.id} variants={FADE_UP}>
              <Card className={rule.enabled ? "" : "opacity-50"}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${rule.enabled ? "bg-primary/10" : "bg-muted"}`}>
                    <Zap className={`h-4 w-4 ${rule.enabled ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{rule.name}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-md bg-muted/50">{TRIGGER_LABELS[rule.trigger] ?? rule.trigger} &gt; {rule.triggerValue}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="px-2 py-0.5 rounded-md bg-muted/50">{ACTION_LABELS[rule.action] ?? rule.action}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                    <Play className="h-3 w-3" />{rule.firedCount} fired
                  </div>
                  <Switch checked={rule.enabled} onCheckedChange={(v) => handleToggle(rule.id, v)} />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(rule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        {newOpen && <NewRuleDialog groupId={groupId} onClose={() => setNewOpen(false)} />}
      </Dialog>
    </motion.div>
  );
}

export default function AutomationPage() {
  return <GroupProvider><MainLayout><AutomationContent /></MainLayout></GroupProvider>;
}
