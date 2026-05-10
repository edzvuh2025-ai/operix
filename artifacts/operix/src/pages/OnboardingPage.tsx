import React, { useState, useEffect } from 'react';
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const group = await api.groups.create({ name: form.name, robloxId: parseInt(form.robloxId) });
      navigate(`/dashboard/${group.id}`);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08090d] to-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Operix</h1>
          <p className="text-gray-400">Manage your Roblox groups with ease</p>
        </div>

        {groups.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {groups.map((group: any) => (
                <Card key={group.id} className="cursor-pointer hover:border-blue-500 transition-colors" onClick={() => navigate(`/dashboard/${group.id}`)}>
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm">Roblox ID: {group.robloxId}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} size="lg" variant="primary" className="w-full py-3 text-lg">
            Create New Group
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  placeholder="Group Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Roblox Group ID"
                  type="number"
                  value={form.robloxId}
                  onChange={(e) => setForm({ ...form, robloxId: e.target.value })}
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" className="flex-1" disabled={creating}>
                    {creating ? 'Creating...' : 'Create'}
                  </Button>
                  <Button type="button" onClick={() => setShowForm(false)} variant="secondary" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
