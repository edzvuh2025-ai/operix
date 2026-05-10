import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Users, AlertCircle, Clock, Activity } from 'lucide-react';
import { api } from '@/lib/api';
export default function DashboardPage() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [stats, setStats] = useState({ staff: 0, cases: 0, sessions: 0, activities: 0 });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            api.groups.get(groupId),
            api.staff.list(groupId).then((d) => setStats((s) => ({ ...s, staff: d.length }))),
            api.cases.list(groupId).then((d) => setStats((s) => ({ ...s, cases: d.length }))),
            api.sessions.list(groupId).then((d) => setStats((s) => ({ ...s, sessions: d.filter((s) => !s.endedAt).length }))),
            api.activity.list(groupId).then((d) => setStats((s) => ({ ...s, activities: d.length }))),
        ])
            .then(([g]) => setGroup(g))
            .finally(() => setLoading(false));
    }, [groupId]);
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { className: "p-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: group?.name }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsx(Card, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Staff Members" }), _jsx("p", { className: "text-3xl font-bold", children: stats.staff })] }), _jsx(Users, { className: "w-8 h-8 text-blue-600" })] }) }), _jsx(Card, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Cases" }), _jsx("p", { className: "text-3xl font-bold", children: stats.cases })] }), _jsx(AlertCircle, { className: "w-8 h-8 text-orange-600" })] }) }), _jsx(Card, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Active Sessions" }), _jsx("p", { className: "text-3xl font-bold", children: stats.sessions })] }), _jsx(Clock, { className: "w-8 h-8 text-green-600" })] }) }), _jsx(Card, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Activities" }), _jsx("p", { className: "text-3xl font-bold", children: stats.activities })] }), _jsx(Activity, { className: "w-8 h-8 text-purple-600" })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Group Info" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "ID:" }), " ", _jsx("span", { className: "font-mono", children: group?.id })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "Roblox ID:" }), " ", _jsx("span", { className: "font-mono", children: group?.robloxId })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "Created:" }), " ", new Date(group?.createdAt).toLocaleDateString()] })] })] })] }));
}
