import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { Users, AlertCircle, Clock, Activity } from 'lucide-react';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<any>(null);
  const [stats, setStats] = useState({ staff: 0, cases: 0, sessions: 0, activities: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.groups.get(groupId!),
      api.staff.list(groupId!).then((d) => setStats((s) => ({ ...s, staff: d.length }))),
      api.cases.list(groupId!).then((d) => setStats((s) => ({ ...s, cases: d.length }))),
      api.sessions.list(groupId!).then((d) => setStats((s) => ({ ...s, sessions: d.filter((s: any) => !s.endedAt).length }))),
      api.activity.list(groupId!).then((d) => setStats((s) => ({ ...s, activities: d.length }))),
    ])
      .then(([g]) => setGroup(g))
      .finally(() => setLoading(false));
  }, [groupId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">{group?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Staff Members</p>
              <p className="text-3xl font-bold">{stats.staff}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Cases</p>
              <p className="text-3xl font-bold">{stats.cases}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Sessions</p>
              <p className="text-3xl font-bold">{stats.sessions}</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Activities</p>
              <p className="text-3xl font-bold">{stats.activities}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Group Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div><span className="text-gray-400">ID:</span> <span className="font-mono">{group?.id}</span></div>
          <div><span className="text-gray-400">Roblox ID:</span> <span className="font-mono">{group?.robloxId}</span></div>
          <div><span className="text-gray-400">Created:</span> {new Date(group?.createdAt).toLocaleDateString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
