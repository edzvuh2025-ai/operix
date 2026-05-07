import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useGroup(groupId: string) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.groups.get(groupId)
      .then(setGroup)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [groupId]);

  return { group, loading, error };
}
