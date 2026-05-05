import { GroupProvider, useGroupContext } from "@/lib/group-context";
import { MainLayout } from "@/components/layout/main-layout";
import { useListSessions, getListSessionsQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Server } from "lucide-react";

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const FADE_UP = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

function SessionsContent() {
  const { activeGroup } = useGroupContext();
  const groupId = activeGroup?.id ?? 0;

  const { data: sessions = [], isLoading } = useListSessions(groupId, {}, {
    query: { enabled: !!groupId, queryKey: getListSessionsQueryKey(groupId), refetchInterval: 10000 }
  });

  const active = sessions.filter(s => s.active);
  const history = sessions.filter(s => !s.active);

  const formatDuration = (mins: number | null | undefined) => {
    if (!mins) return "—";
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
        <p className="text-muted-foreground text-sm mt-1">{active.length} active · {history.length} historical</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Live Now</h2>
              <motion.div variants={STAGGER} initial="hidden" animate="show" className="space-y-2">
                {active.map(s => (
                  <motion.div key={s.id} variants={FADE_UP}>
                    <Card className="border-emerald-500/30 bg-emerald-500/5">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <div className="flex-1 min-w-0 grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 min-w-0"><User className="h-3.5 w-3.5 text-muted-foreground shrink-0" /><span className="font-medium truncate">{s.staffUsername || "Unknown"}</span></div>
                          <div className="flex items-center gap-2 min-w-0"><Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" /><span className="text-muted-foreground truncate">{s.serverName || "—"}</span></div>
                          <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-muted-foreground">Started {new Date(s.startedAt).toLocaleTimeString()}</span></div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shrink-0">Live</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">History</h2>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No session history yet</p>
            ) : (
              <motion.div variants={STAGGER} initial="hidden" animate="show" className="space-y-2">
                {history.map(s => (
                  <motion.div key={s.id} variants={FADE_UP}>
                    <Card>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0 grid grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 min-w-0"><User className="h-3.5 w-3.5 text-muted-foreground shrink-0" /><span className="font-medium truncate">{s.staffUsername || "Unknown"}</span></div>
                          <div className="flex items-center gap-2 min-w-0"><Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" /><span className="text-muted-foreground truncate">{s.serverName || "—"}</span></div>
                          <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-muted-foreground">{formatDuration(s.durationMinutes)}</span></div>
                          <div className="text-muted-foreground text-right">{new Date(s.startedAt).toLocaleDateString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function SessionsPage() {
  return <GroupProvider><MainLayout><SessionsContent /></MainLayout></GroupProvider>;
}
