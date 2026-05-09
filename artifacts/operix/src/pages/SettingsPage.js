import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';
export default function SettingsPage() {
    const { groupId } = useParams();
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ description: '', discord: '', website: '' });
    useEffect(() => {
        api.settings.get(groupId).then(setForm).finally(() => setLoading(false));
    }, [groupId]);
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.settings.update(groupId, form);
            alert('Settings saved!');
        }
        catch (e) {
            alert('Error: ' + e.message);
        }
    };
    if (loading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { className: "p-8 max-w-2xl", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Group Settings" }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Basic Settings" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSave, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", children: "Description" }), _jsx(Textarea, { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", children: "Discord Server URL" }), _jsx(Input, { value: form.discord, onChange: (e) => setForm({ ...form, discord: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", children: "Website" }), _jsx(Input, { value: form.website, onChange: (e) => setForm({ ...form, website: e.target.value }) })] }), _jsx(Button, { type: "submit", className: "bg-blue-600 hover:bg-blue-700 w-full", children: "Save Settings" })] }) })] })] }));
}
