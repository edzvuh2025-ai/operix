import { useGroupContext } from "@/lib/group-context";
import { useGetDashboardStats, useGetActivityFeed, useListAlerts, useMarkAlertRead, getGetDashboardStatsQueryKey, getGetActivityFeedQueryKey, getListAlertsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { GroupProvider } from "@/lib/group-context";
import { MainLayout } from "@/components/layout/main-layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Clock, ShieldAlert, Zap, Activity, Bell, TrendingUp, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FADE_UP = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function StatCard({ label, value, icon: Icon, delta, color = "primary" }: { label: string; value: number | string; icon: any; delta?: string; color?: string }) {
  return (
    <motion.div variants={FADE_UP}>
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{label}</p>
              <p className="text-3xl font-bold mt-1 tracking-tight">{value}</p>
              {delta && <p className="text-xs text-muted-foreground mt-1">{delta}</p>}
            </div>
            <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = { info: "bg-blue-500/10 text-blue-400 border-blue-500/20", warning: "bg-amber-500/10 text-amber-400 border-amber-500/20", critical: "bg-red-500/10 text-red-400 border-red-500/20" };
  return <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[severity] ?? map.info}`}>{severity}</span>;
}

const MOCK_CHART = [
  { day: "Mon", minutes: 120 }, { day: "Tue", minutes: 190 }, { day: "Wed", minutes: 80 },
  { day: "Thu", minutes: 240 }, { day: "Fri", minutes: 170 }, { day: "Sat", minutes: 300 }, { day: "Sun", minutes: 210 },
];

function DashboardContent() {
  const { activeGroup } = useGroupContext();
  const groupId = activeGroup?.id ?? 0;
  const qc = useQueryClient();

  const { data: stats, isLoading } = useGetDashboardStats(groupId, { query: { enabled: !!groupId, queryKey: getGetDashboardStatsQueryKey(groupId) } });
  const { data: activity = [] } = useGetActivityFeed(groupId, {}, { query: { enabled: !!groupId, queryKey: getGetActivityFeedQueryKey(groupId) } });
  const { data: alerts = [] } = useListAlerts(groupId, {}, { query: { enabled: !!groupId, queryKey: getListAlertsQueryKey(groupId) } });
  const markRead = useMarkAlertRead();

  const handleMarkRead = (alertId: number) => {
    markRead.mutate({ groupId, alertId }, {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListAlertsQueryKey(groupId) }),
    });
  };

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
      <div className="grid grid-cols-3 gap-4">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}</div>
    </div>
  );

  const unreadAlerts = alerts.filter(a => !a.read);

  return (
    <motion.div variants={STAGGER} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={FADE_UP}>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">{activeGroup?.name} — live overview</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Staff" value={stats?.totalStaff ?? 0} icon={Users} delta={`${stats?.activeStaff ?? 0} active`} />
        <StatCard label="Active Sessions" value={stats?.activeSessions ?? 0} icon={Clock} delta={`${stats?.totalSessionsToday ?? 0} today`} />
        <StatCard label="Open Cases" value={stats?.openCases ?? 0} icon={ShieldAlert} />
        <StatCard label="Pending Alerts" value={stats?.pendingAlerts ?? 0} icon={Bell} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={FADE_UP} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Activity className="h-4 w-4" /> Activity This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MOCK_CHART}>
                  <defs>
                    <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(215 20.2% 65.1%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(215 20.2% 65.1%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 5%)", border: "1px solid hsl(217 32% 17%)", borderRadius: "8px", fontSize: 12 }} />
                  <Area type="monotone" dataKey="minutes" stroke="hsl(217 91% 60%)" strokeWidth={2} fill="url(#colorMin)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={FADE_UP}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Top Performers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(stats?.topPerformers ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
              ) : (stats?.topPerformers ?? []).map((s: any, i: number) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-4 font-mono">{i + 1}</span>
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.robloxUsername.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.robloxUsername}</p>
                    <p className="text-xs text-muted-foreground">{s.totalActivityMinutes}m activity</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={FADE_UP}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Bell className="h-4 w-4" /> Alerts <Badge variant="secondary" className="ml-auto">{unreadAlerts.length}</Badge></CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {unreadAlerts.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">All clear</p> : unreadAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1"><SeverityBadge severity={alert.severity} /></div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0" onClick={() => handleMarkRead(alert.id)}><CheckCircle className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={FADE_UP}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Zap className="h-4 w-4" /> Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activity.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No activity yet</p> : activity.slice(0, 6).map((item: any) => (
                <div key={item.id} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{item.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(item.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <GroupProvider>
      <MainLayout>
        <DashboardContent />
      </MainLayout>
    </GroupProvider>
  );
}
