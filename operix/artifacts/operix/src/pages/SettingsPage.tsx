import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ description: '', discord: '', website: '' });

  useEffect(() => {
    api.settings.get(groupId!).then(setForm).finally(() => setLoading(false));
  }, [groupId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.settings.update(groupId!, form);
      alert('Settings saved!');
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Group Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Basic Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Discord Server URL</label>
              <Input value={form.discord} onChange={(e) => setForm({ ...form, discord: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Website</label>
              <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
