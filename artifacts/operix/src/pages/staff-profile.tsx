import { useState } from "react";
import { Link, useRoute } from "wouter";
import { GroupProvider, useGroupContext } from "@/lib/group-context";
import { MainLayout } from "@/components/layout/main-layout";
import { useGetStaffMember, useGenerateStaffSummary, getGetStaffMemberQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Sparkles, Clock, ShieldAlert, AlertTriangle, Activity } from "lucide-react";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  flagged: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  suspended: "bg-red-500/10 text-red-400 border-red-500/20",
};

const SEVERITY_STYLE: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-400", medium: "bg-amber-500/10 text-amber-400",
  high: "bg-orange-500/10 text-orange-400", critical: "bg-red-500/10 text-red-400",
};

function StaffProfileContent() {
  const { activeGroup } = useGroupContext();
  const [, params] = useRoute("/staff/:staffId");
  const staffId = parseInt(params?.staffId ?? "0");
  const groupId = activeGroup?.id ?? 0;
  const [aiSummary, setAiSummary] = useState<any>(null);

  const { data: staff, isLoading } = useGetStaffMember(groupId, staffId, {
    query: { enabled: !!groupId && !!staffId, queryKey: getGetStaffMemberQueryKey(groupId, staffId) }
  });

  const generateSummary = useGenerateStaffSummary();

  const handleGenerateSummary = () => {
    generateSummary.mutate({ groupId, staffId }, {
      onSuccess: (data) => setAiSummary(data),
    });
  };

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );

  if (!staff) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Staff member not found.</p>
      <Link href="/staff"><Button variant="link" className="mt-4">Back to Staff</Button></Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/staff"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Staff</Button></Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
              {staff.robloxUsername.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{staff.robloxUsername}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_STYLE[staff.status] ?? STATUS_STYLE.inactive}`}>{staff.status}</span>
              </div>
              <p className="text-muted-foreground">{staff.rank || staff.role}</p>
              <div className="flex gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /><span>{staff.totalActivityMinutes}m total</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Activity className="h-4 w-4" /><span>{staff.sessionsCount} sessions</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><ShieldAlert className="h-4 w-4" /><span>{staff.casesCount} cases</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><AlertTriangle className="h-4 w-4" /><span>{staff.warningsCount} warnings</span></div>
              </div>
            </div>
            <Button onClick={handleGenerateSummary} disabled={generateSummary.isPending} className="gap-2 shrink-0">
              <Sparkles className="h-4 w-4" />
              {generateSummary.isPending ? "Analyzing..." : "AI Summary"}
            </Button>
          </div>

          {aiSummary && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-2 text-primary text-sm font-semibold"><Sparkles className="h-4 w-4" /> AI Performance Analysis</div>
              <p className="text-sm leading-relaxed mb-3">{aiSummary.summary}</p>
              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground">Score: <span className="text-foreground font-medium">{aiSummary.performanceScore}/100</span></div>
                <div className="text-xs text-muted-foreground">Recommendation: <span className="text-primary font-medium capitalize">{aiSummary.recommendation}</span></div>
              </div>
              {aiSummary.highlights?.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {aiSummary.highlights.map((h: string, i: number) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{h}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
        </TabsList>
        <TabsContent value="sessions" className="mt-4 space-y-2">
          {((staff as any).recentSessions ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No sessions recorded</p>
          ) : ((staff as any).recentSessions ?? []).map((s: any) => (
            <Card key={s.id}><CardContent className="p-4 flex items-center gap-4 text-sm">
              <div className={`h-2 w-2 rounded-full shrink-0 ${s.active ? "bg-emerald-400" : "bg-muted-foreground"}`} />
              <span className="font-medium">{s.serverName || "Unknown Server"}</span>
              <span className="text-muted-foreground ml-auto">{s.durationMinutes ?? 0}m</span>
              <span className="text-muted-foreground">{new Date(s.startedAt).toLocaleDateString()}</span>
            </CardContent></Card>
          ))}
        </TabsContent>
        <TabsContent value="cases" className="mt-4 space-y-2">
          {((staff as any).recentCases ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No cases</p>
          ) : ((staff as any).recentCases ?? []).map((c: any) => (
            <Link key={c.id} href={`/cases/${c.id}`}>
              <Card className="hover:bg-muted/10 cursor-pointer transition-colors"><CardContent className="p-4 flex items-center gap-3 text-sm">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_STYLE[c.severity] ?? SEVERITY_STYLE.low}`}>{c.severity}</span>
                <span className="font-medium flex-1">{c.title}</span>
                <span className="text-muted-foreground capitalize">{c.status}</span>
              </CardContent></Card>
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default function StaffProfilePage() {
  return <GroupProvider><MainLayout><StaffProfileContent /></MainLayout></GroupProvider>;
}
