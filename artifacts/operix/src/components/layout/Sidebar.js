import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useParams } from 'react-router-dom';
import { Users, FileText, Clock, Settings, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
export function Sidebar() {
    const { groupId } = useParams();
    const links = [
        { label: 'Dashboard', href: `/dashboard/${groupId}`, icon: BarChart3 },
        { label: 'Staff', href: `/groups/${groupId}/staff`, icon: Users },
        { label: 'Cases', href: `/groups/${groupId}/cases`, icon: FileText },
        { label: 'Sessions', href: `/groups/${groupId}/sessions`, icon: Clock },
        { label: 'Settings', href: `/groups/${groupId}/settings`, icon: Settings },
    ];
    return (_jsxs("aside", { className: "w-64 bg-[#0f1117] border-r border-[#1e2028] p-6 h-screen sticky top-0", children: [_jsx("h1", { className: "text-2xl font-bold mb-8 text-blue-600", children: "Operix" }), _jsx("nav", { className: "space-y-2", children: links.map(({ label, href, icon: Icon }) => (_jsxs(NavLink, { to: href, className: ({ isActive }) => cn('flex items-center gap-3 px-4 py-2 rounded-lg transition-colors', isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-[#1e2028] hover:text-white'), children: [_jsx(Icon, { className: "w-5 h-5" }), label] }, href))) })] }));
}
