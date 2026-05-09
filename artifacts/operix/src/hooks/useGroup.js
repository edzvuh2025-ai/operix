import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
export function useGroup(groupId) {
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        api.groups.get(groupId)
            .then(setGroup)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [groupId]);
    return { group, loading, error };
}
