import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Trash2, Plus, Users } from 'lucide-react';
import { api } from '@/lib/api';

export default function StaffPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ robloxId: '', username: '', role: '' });

  useEffect(() => {
    api.staff.list(groupId!).then(setStaff).finally(() => setLoading(false));
  }, [groupId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newStaff = await api.staff.create(groupId!, {
        robloxId: parseInt(form.robloxId),
        username: form.username,
        role: form.role,
      });
      setStaff([...staff, newStaff]);
      setForm({ robloxId: '', username: '', role: '' });
      setShowModal(false);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this staff member?')) return;
    try {
      await api.staff.delete(groupId!, id);
      setStaff(staff.filter((s) => s.id !== id));
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Staff Members</h1>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {staff.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="No staff yet" description="Add your first staff member to get started" />
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2028]">
                <th className="text-left py-3 px-4 font-semibold">Username</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">Roblox ID</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-[#1e2028] hover:bg-[#0f1117]">
                  <td className="py-3 px-4">{s.username}</td>
                  <td className="py-3 px-4"><Badge variant={s.role === 'Owner' ? 'danger' : s.role === 'Admin' ? 'warning' : 'default'}>{s.role}</Badge></td>
                  <td className="py-3 px-4">{s.robloxId}</td>
                  <td className="py-3 px-4">
                    <Button onClick={() => handleDelete(s.id)} variant="danger" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Staff Member">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <Input
            placeholder="Roblox ID"
            type="number"
            value={form.robloxId}
            onChange={(e) => setForm({ ...form, robloxId: e.target.value })}
            required
          />
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
            <option value="">Select Role</option>
            <option value="Moderator">Moderator</option>
            <option value="Admin">Admin</option>
            <option value="Owner">Owner</option>
          </Select>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Add Staff Member
          </Button>
        </form>
      </Modal>
    </div>
  );
}
