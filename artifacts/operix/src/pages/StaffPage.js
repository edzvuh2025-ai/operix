import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Trash2, Plus, Users } from 'lucide-react';
import { api } from '@/lib/api';
export default function StaffPage() {
    const { groupId } = useParams();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ robloxId: '', username: '', role: '' });
    useEffect(() => {
        api.staff.list(groupId).then(setStaff).finally(() => setLoading(false));
    }, [groupId]);
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const newStaff = await api.staff.create(groupId, {
                robloxId: parseInt(form.robloxId),
                username: form.username,
                role: form.role,
            });
            setStaff([...staff, newStaff]);
            setForm({ robloxId: '', username: '', role: '' });
            setShowModal(false);
        }
        catch (e) {
            alert('Error: ' + e.message);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Remove this staff member?'))
            return;
        try {
            await api.staff.delete(groupId, id);
            setStaff(staff.filter((s) => s.id !== id));
        }
        catch (e) {
            alert('Error: ' + e.message);
        }
    };
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Staff Members" }), _jsxs(Button, { onClick: () => setShowModal(true), className: "bg-blue-600 hover:bg-blue-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Staff"] })] }), staff.length === 0 ? (_jsx(Card, { children: _jsx(EmptyState, { icon: Users, title: "No staff yet", description: "Add your first staff member to get started" }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-[#1e2028]", children: [_jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Username" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Role" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Roblox ID" }), _jsx("th", { className: "text-left py-3 px-4 font-semibold", children: "Actions" })] }) }), _jsx("tbody", { children: staff.map((s) => (_jsxs("tr", { className: "border-b border-[#1e2028] hover:bg-[#0f1117]", children: [_jsx("td", { className: "py-3 px-4", children: s.username }), _jsx("td", { className: "py-3 px-4", children: _jsx(Badge, { variant: s.role === 'Owner' ? 'danger' : s.role === 'Admin' ? 'warning' : 'default', children: s.role }) }), _jsx("td", { className: "py-3 px-4", children: s.robloxId }), _jsx("td", { className: "py-3 px-4", children: _jsx(Button, { onClick: () => handleDelete(s.id), variant: "danger", size: "sm", children: _jsx(Trash2, { className: "w-4 h-4" }) }) })] }, s.id))) })] }) })), _jsx(Modal, { isOpen: showModal, onClose: () => setShowModal(false), title: "Add Staff Member", children: _jsxs("form", { onSubmit: handleAdd, className: "space-y-4", children: [_jsx(Input, { placeholder: "Username", value: form.username, onChange: (e) => setForm({ ...form, username: e.target.value }), required: true }), _jsx(Input, { placeholder: "Roblox ID", type: "number", value: form.robloxId, onChange: (e) => setForm({ ...form, robloxId: e.target.value }), required: true }), _jsxs(Select, { value: form.role, onChange: (e) => setForm({ ...form, role: e.target.value }), required: true, children: [_jsx("option", { value: "", children: "Select Role" }), _jsx("option", { value: "Moderator", children: "Moderator" }), _jsx("option", { value: "Admin", children: "Admin" }), _jsx("option", { value: "Owner", children: "Owner" })] }), _jsx(Button, { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700", children: "Add Staff Member" })] }) })] }));
}
