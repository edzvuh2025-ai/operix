import React, { useState, useEffect } from 'react';
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
  const { groupId } = useParams<{ groupId: string }>();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [robloxId, setRobloxId] = useState('');

  useEffect(() => {
    api.sessions.list(groupId!).then(setSessions).finally(() => setLoading(false));
  }, [groupId]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSession = await api.sessions.create(groupId!, { staffRobloxId: parseInt(robloxId) });
      setSessions([...sessions, newSession]);
      setRobloxId('');
      setShowModal(false);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleEnd = async (id: number) => {
    try {
      const updated = await api.sessions.end(groupId!, id);
      setSessions(sessions.map((s) => (s.id === id ? updated : s)));
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  const active = sessions.filter((s) => !s.endedAt);
  const ended = sessions.filter((s) => s.endedAt);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Staff Sessions</h1>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Start Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <EmptyState icon={Clock} title="No sessions" description="Start a new staff session" />
        </Card>
      ) : (
        <>
          {active.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
              <div className="space-y-4 mb-8">
                {active.map((s) => (
                  <Card key={s.id}>
                    <div className="flex justify-between items-center">
                      <div>
                        <Badge variant="success" className="mb-2">
                          ACTIVE
                        </Badge>
                        <p className="font-semibold">Staff ID: {s.staffRobloxId}</p>
                        <p className="text-gray-400 text-sm">Started: {new Date(s.startedAt).toLocaleString()}</p>
                      </div>
                      <Button onClick={() => handleEnd(s.id)} variant="danger">
                        <X className="w-4 h-4 mr-2" />
                        End
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {ended.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Ended Sessions</h2>
              <div className="space-y-4">
                {ended.map((s) => (
                  <Card key={s.id} className="opacity-75">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Staff ID: {s.staffRobloxId}</p>
                        <p className="text-gray-400 text-sm">Started: {new Date(s.startedAt).toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">Ended: {new Date(s.endedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Start Session">
        <form onSubmit={handleStart} className="space-y-4">
          <Input placeholder="Staff Roblox ID" type="number" value={robloxId} onChange={(e) => setRobloxId(e.target.value)} required />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Start Session
          </Button>
        </form>
      </Modal>
    </div>
  );
}
