// src/features/protocols/hooks/useProtocolData.js
import { useState, useEffect, useCallback } from 'react';
import ProtocolStore from '../store/ProtocolStore';

export const useProtocolData = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await ProtocolStore.fetchProtocolsAll();
        setProtocols(ProtocolStore.protocols || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refetchProtocols = useCallback(async () => {
    await ProtocolStore.fetchProtocolsAll();
    setProtocols(ProtocolStore.protocols || []);
  }, []);

  return { protocols, loading, error, refetchProtocols };
};
