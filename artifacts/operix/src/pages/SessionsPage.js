import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Plus, Clock, X } from 'lucide-react';
import { api } from '@/lib/api';
export default function SessionsPage() {
    const { groupId } = useParams();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [robloxId, setRobloxId] = useState('');
    useEffect(() => {
        api.sessions.list(groupId).then(setSessions).finally(() => setLoading(false));
    }, [groupId]);
    const handleStart = async (e) => {
        e.preventDefault();
        try {
            const newSession = await api.sessions.create(groupId, { staffRobloxId: parseInt(robloxId) });
            setSessions([...sessions, newSession]);
            setRobloxId('');
            setShowModal(false);
        }
        catch (e) {
            alert('Error: ' + e.message);
        }
    };
    const handleEnd = async (id) => {
        try {
            const updated = await api.sessions.end(groupId, id);
            setSessions(sessions.map((s) => (s.id === id ? updated : s)));
        }
        catch (e) {
            alert('Error: ' + e.message);
        }
    };
    if (loading)
        return _jsx(LoadingSpinner, {});
    const active = sessions.filter((s) => !s.endedAt);
    const ended = sessions.filter((s) => s.endedAt);
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Staff Sessions" }), _jsxs(Button, { onClick: () => setShowModal(true), className: "bg-blue-600 hover:bg-blue-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Start Session"] })] }), sessions.length === 0 ? (_jsx(Card, { children: _jsx(EmptyState, { icon: Clock, title: "No sessions", description: "Start a new staff session" }) })) : (_jsxs(_Fragment, { children: [active.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Active Sessions" }), _jsx("div", { className: "space-y-4 mb-8", children: active.map((s) => (_jsx(Card, { children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx(Badge, { variant: "success", className: "mb-2", children: "ACTIVE" }), _jsxs("p", { className: "font-semibold", children: ["Staff ID: ", s.staffRobloxId] }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Started: ", new Date(s.startedAt).toLocaleString()] })] }), _jsxs(Button, { onClick: () => handleEnd(s.id), variant: "danger", children: [_jsx(X, { className: "w-4 h-4 mr-2" }), "End"] })] }) }, s.id))) })] })), ended.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Ended Sessions" }), _jsx("div", { className: "space-y-4", children: ended.map((s) => (_jsx(Card, { className: "opacity-75", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsxs("p", { className: "font-semibold", children: ["Staff ID: ", s.staffRobloxId] }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Started: ", new Date(s.startedAt).toLocaleString()] }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Ended: ", new Date(s.endedAt).toLocaleString()] })] }) }) }, s.id))) })] }))] })), _jsx(Modal, { isOpen: showModal, onClose: () => setShowModal(false), title: "Start Session", children: _jsxs("form", { onSubmit: handleStart, className: "space-y-4", children: [_jsx(Input, { placeholder: "Staff Roblox ID", type: "number", value: robloxId, onChange: (e) => setRobloxId(e.target.value), required: true }), _jsx(Button, { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700", children: "Start Session" })] }) })] }));
}
