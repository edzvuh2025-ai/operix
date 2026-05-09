import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';
export default function OnboardingPage() {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ name: '', robloxId: '' });
    const [showForm, setShowForm] = useState(false);
    useEffect(() => {
        if (isSignedIn) {
            api.groups.list().then(setGroups).finally(() => setLoading(false));
        }
    }, [isSignedIn]);
    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const group = await api.groups.create({ name: form.name, robloxId: parseInt(form.robloxId) });
            navigate(`/dashboard/${group.id}`);
        }
        catch (e) {
            alert('Error: ' + e.message);
        }
        finally {
            setCreating(false);
        }
    };
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#08090d] to-[#0f1117] flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-2xl", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Welcome to Operix" }), _jsx("p", { className: "text-gray-400", children: "Manage your Roblox groups with ease" })] }), groups.length > 0 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Your Groups" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8", children: groups.map((group) => (_jsxs(Card, { className: "cursor-pointer hover:border-blue-500 transition-colors", onClick: () => navigate(`/dashboard/${group.id}`), children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: group.name }) }), _jsx(CardContent, { children: _jsxs("p", { className: "text-gray-400 text-sm", children: ["Roblox ID: ", group.robloxId] }) })] }, group.id))) })] })), !showForm ? (_jsx(Button, { onClick: () => setShowForm(true), className: "w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg", children: "Create New Group" })) : (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Create New Group" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleCreate, className: "space-y-4", children: [_jsx(Input, { placeholder: "Group Name", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), required: true }), _jsx(Input, { placeholder: "Roblox Group ID", type: "number", value: form.robloxId, onChange: (e) => setForm({ ...form, robloxId: e.target.value }), required: true }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "submit", className: "flex-1 bg-blue-600 hover:bg-blue-700", disabled: creating, children: creating ? 'Creating...' : 'Create' }), _jsx(Button, { type: "button", onClick: () => setShowForm(false), variant: "secondary", className: "flex-1", children: "Cancel" })] })] }) })] }))] }) }));
}
