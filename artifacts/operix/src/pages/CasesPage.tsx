import { useState } from "react";
import { Link } from "wouter";
import { GroupProvider, useGroupContext } from "@/lib/group-context";
import { MainLayout } from "@/components/layout/main-layout";
import { useListCases, useCreateCase, getListCasesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ChevronRight, User, FileText } from "lucide-react";

const SEVERITY: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS: Record<string, string> = {
  open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  under_review: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  closed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  appealed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const FADE_UP = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

function NewCaseDialog({ groupId, onClose }: { groupId: number; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [staffUsername, setStaffUsername] = useState("");
  const qc = useQueryClient();
  const create = useCreateCase();

  const handleSubmit = () => {
    if (!title) return;
    create.mutate({ groupId, data: { title, description, severity: severity as any } }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListCasesQueryKey(groupId) }); onClose(); },
    });
  };

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New Case</DialogTitle></DialogHeader>
      <div className="space-y-4 py-2">
        <div><label className="text-sm font-medium mb-1.5 block">Title</label><Input placeholder="Case title" value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Staff Username</label><Input placeholder="Roblox username" value={staffUsername} onChange={e => setStaffUsername(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Description</label><Textarea placeholder="What happened?" value={description} onChange={e => setDescription(e.target.value)} className="resize-none" rows={3} /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Severity</label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={create.isPending || !title}>{create.isPending ? "Creating..." : "Create Case"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function CasesContent() {
  const { activeGroup } = useGroupContext();
  const groupId = activeGroup?.id ?? 0;
  const [statusFilter, setStatusFilter] = useState("all");
  const [newOpen, setNewOpen] = useState(false);

  const { data: cases = [], isLoading } = useListCases(groupId, {}, {
    query: { enabled: !!groupId, queryKey: getListCasesQueryKey(groupId) }
  });

  const filtered = cases.filter(c => statusFilter === "all" || c.status === statusFilter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground text-sm mt-1">{cases.filter(c => c.status === "open").length} open cases</p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> New Case</Button>
      </div>

      <div className="flex items-center gap-2">
        {(["all", "open", "under_review", "closed", "appealed"]).map(s => (
          <Button key={s} size="sm" variant={statusFilter === s ? "default" : "outline"} onClick={() => setStatusFilter(s)} className="capitalize text-xs h-7">
            {s === "all" ? "All" : s.replace("_", " ")}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No cases found</p>
        </div>
      ) : (
        <motion.div variants={STAGGER} initial="hidden" animate="show" className="space-y-2">
          {filtered.map(c => (
            <motion.div key={c.id} variants={FADE_UP}>
              <Link href={`/cases/${c.id}`}>
                <Card className="hover:bg-muted/10 cursor-pointer transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SEVERITY[c.severity] ?? SEVERITY.low}`}>{c.severity}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS[c.status] ?? STATUS.open}`}>{c.status.replace("_", " ")}</span>
                        {c.autoGenerated && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border-primary/20 border">AI</span>}
                      </div>
                      <p className="font-medium text-sm">{c.title}</p>
                      {c.staffUsername && <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><User className="h-3 w-3" />{c.staffUsername}</p>}
                    </div>
                    <div className="text-right text-xs text-muted-foreground shrink-0">
                      <p>{c.evidenceCount} evidence</p>
                      <p className="mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        {newOpen && <NewCaseDialog groupId={groupId} onClose={() => setNewOpen(false)} />}
      </Dialog>
    </motion.div>
  );
}

export default function CasesPage() {
  return <GroupProvider><MainLayout><CasesContent /></MainLayout></GroupProvider>;
}
