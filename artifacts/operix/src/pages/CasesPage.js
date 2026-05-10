import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Plus, FileText } from 'lucide-react';
import { api } from '@/lib/api';
export default function CasesPage() {
    const { groupId } = useParams();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ targetUsername: '', targetRobloxId: '', reason: '', action: '', handledBy: '' });
    useEffect(() => {
        api.cases.list(groupId).then(setCases).finally(() => setLoading(false));
    }, [groupId]);
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const newCase = await api.cases.create(groupId, {
                targetUsername: form.targetUsername,
                targetRobloxId: parseInt(form.targetRobloxId),
                reason: form.reason,
                action: form.action,
                handledBy: form.handledBy,
            });
            setCases([...cases, newCase]);
            setForm({ targetUsername: '', targetRobloxId: '', reason: '', action: '', handledBy: '' });
            setShowModal(false);
        }
        catch (e) {
            alert('Error: ' + e.message);
        }
    };
    const handleUpdateStatus = async (id, status) => {
        try {
            const updated = await api.cases.update(groupId, id, { status });
            setCases(cases.map((c) => (c.id === id ? updated : c)));
        }
        catch (e) {
            alert('Error: ' + e.message);
        }
    };
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Moderation Cases" }), _jsxs(Button, { onClick: () => setShowModal(true), className: "bg-blue-600 hover:bg-blue-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "New Case"] })] }), cases.length === 0 ? (_jsx(Card, { children: _jsx(EmptyState, { icon: FileText, title: "No cases", description: "Create your first moderation case" }) })) : (_jsx("div", { className: "space-y-4", children: cases.map((c) => (_jsx(Card, { children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-semibold text-lg", children: c.targetUsername }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Reason: ", c.reason] }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Action: ", c.action] }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Handled by: ", c.handledBy] }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Created: ", new Date(c.createdAt).toLocaleDateString()] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Badge, { variant: c.status === 'open' ? 'warning' : 'success', children: c.status.toUpperCase() }), c.status === 'open' && (_jsx(Button, { onClick: () => handleUpdateStatus(c.id, 'closed'), size: "sm", className: "bg-green-600 hover:bg-green-700", children: "Close" }))] })] }) }, c.id))) })), _jsx(Modal, { isOpen: showModal, onClose: () => setShowModal(false), title: "Create Moderation Case", children: _jsxs("form", { onSubmit: handleCreate, className: "space-y-4", children: [_jsx(Input, { placeholder: "Target Username", value: form.targetUsername, onChange: (e) => setForm({ ...form, targetUsername: e.target.value }), required: true }), _jsx(Input, { placeholder: "Target Roblox ID", type: "number", value: form.targetRobloxId, onChange: (e) => setForm({ ...form, targetRobloxId: e.target.value }), required: true }), _jsx(Textarea, { placeholder: "Reason", value: form.reason, onChange: (e) => setForm({ ...form, reason: e.target.value }), required: true }), _jsxs(Select, { value: form.action, onChange: (e) => setForm({ ...form, action: e.target.value }), required: true, children: [_jsx("option", { value: "", children: "Select Action" }), _jsx("option", { value: "Warn", children: "Warn" }), _jsx("option", { value: "Kick", children: "Kick" }), _jsx("option", { value: "Ban", children: "Ban" })] }), _jsx(Input, { placeholder: "Handled By", value: form.handledBy, onChange: (e) => setForm({ ...form, handledBy: e.target.value }), required: true }), _jsx(Button, { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700", children: "Create Case" })] }) })] }));
}
