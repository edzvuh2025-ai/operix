import React, { useState, useEffect } from 'react';
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
  const { groupId } = useParams<{ groupId: string }>();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ targetUsername: '', targetRobloxId: '', reason: '', action: '', handledBy: '' });

  useEffect(() => {
    api.cases.list(groupId!).then(setCases).finally(() => setLoading(false));
  }, [groupId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCase = await api.cases.create(groupId!, {
        targetUsername: form.targetUsername,
        targetRobloxId: parseInt(form.targetRobloxId),
        reason: form.reason,
        action: form.action,
        handledBy: form.handledBy,
      });
      setCases([...cases, newCase]);
      setForm({ targetUsername: '', targetRobloxId: '', reason: '', action: '', handledBy: '' });
      setShowModal(false);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const updated = await api.cases.update(groupId!, id, { status });
      setCases(cases.map((c) => (c.id === id ? updated : c)));
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Moderation Cases</h1>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Case
        </Button>
      </div>

      {cases.length === 0 ? (
        <Card>
          <EmptyState icon={FileText} title="No cases" description="Create your first moderation case" />
        </Card>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => (
            <Card key={c.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{c.targetUsername}</p>
                  <p className="text-gray-400 text-sm">Reason: {c.reason}</p>
                  <p className="text-gray-400 text-sm">Action: {c.action}</p>
                  <p className="text-gray-400 text-sm">Handled by: {c.handledBy}</p>
                  <p className="text-gray-400 text-sm">Created: {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={c.status === 'open' ? 'warning' : 'success'}>{c.status.toUpperCase()}</Badge>
                  {c.status === 'open' && (
                    <Button onClick={() => handleUpdateStatus(c.id, 'closed')} size="sm" className="bg-green-600 hover:bg-green-700">
                      Close
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Moderation Case">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input placeholder="Target Username" value={form.targetUsername} onChange={(e) => setForm({ ...form, targetUsername: e.target.value })} required />
          <Input placeholder="Target Roblox ID" type="number" value={form.targetRobloxId} onChange={(e) => setForm({ ...form, targetRobloxId: e.target.value })} required />
          <Textarea placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
          <Select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} required>
            <option value="">Select Action</option>
            <option value="Warn">Warn</option>
            <option value="Kick">Kick</option>
            <option value="Ban">Ban</option>
          </Select>
          <Input placeholder="Handled By" value={form.handledBy} onChange={(e) => setForm({ ...form, handledBy: e.target.value })} required />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Create Case
          </Button>
        </form>
      </Modal>
    </div>
  );
}
