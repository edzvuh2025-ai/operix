import { useState } from "react";
import { Link } from "wouter";
import { GroupProvider, useGroupContext } from "@/lib/group-context";
import { MainLayout } from "@/components/layout/main-layout";
import { useListStaff, useCreateStaffMember, getListStaffQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, ChevronRight, Clock, ShieldAlert } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  flagged: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  suspended: "bg-red-500/10 text-red-400 border-red-500/20",
};

const FADE_UP = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

function StatusBadge({ status }: { status: string }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_STYLE[status] ?? STATUS_STYLE.inactive}`}>{status}</span>;
}

function AddStaffDialog({ groupId, onClose }: { groupId: number; onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [rank, setRank] = useState("");
  const [role, setRole] = useState("staff");
  const qc = useQueryClient();
  const create = useCreateStaffMember();

  const handleSubmit = () => {
    if (!username) return;
    create.mutate({ groupId, data: { robloxUsername: username, rank, role: role as any } }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListStaffQueryKey(groupId) }); onClose(); },
    });
  };

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Add Staff Member</DialogTitle></DialogHeader>
      <div className="space-y-4 py-2">
        <div><label className="text-sm font-medium mb-1.5 block">Roblox Username</label><Input placeholder="e.g. Builderman" value={username} onChange={e => setUsername(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Rank</label><Input placeholder="e.g. Senior Moderator" value={rank} onChange={e => setRank(e.target.value)} /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Role</label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={create.isPending || !username}>
          {create.isPending ? "Adding..." : "Add Member"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function StaffContent() {
  const { activeGroup } = useGroupContext();
  const groupId = activeGroup?.id ?? 0;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);

  const { data: staff = [], isLoading } = useListStaff(groupId, {}, { query: { enabled: !!groupId, queryKey: getListStaffQueryKey(groupId) } });

  const filtered = staff.filter(s =>
    s.robloxUsername.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "all" || s.status === statusFilter)
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">{staff.length} members</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Member</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No staff found</p>
          <p className="text-sm mt-1">Try adjusting your search or add a new member.</p>
        </div>
      ) : (
        <motion.div variants={STAGGER} initial="hidden" animate="show" className="space-y-2">
          {filtered.map(s => (
            <motion.div key={s.id} variants={FADE_UP}>
              <Link href={`/staff/${s.id}`}>
                <Card className="hover:bg-muted/10 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {s.robloxUsername.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{s.robloxUsername}</p>
                        <StatusBadge status={s.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.rank || s.role}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{s.totalActivityMinutes}m</span>
                      <span className="flex items-center gap-1.5"><ShieldAlert className="h-3 w-3" />{s.casesCount} cases</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        {addOpen && <AddStaffDialog groupId={groupId} onClose={() => setAddOpen(false)} />}
      </Dialog>
    </motion.div>
  );
}

export default function StaffPage() {
  return <GroupProvider><MainLayout><StaffContent /></MainLayout></GroupProvider>;
}
