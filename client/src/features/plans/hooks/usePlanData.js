// src/features/plans/hooks/usePlanData.js
import { useState, useEffect, useCallback } from 'react';
import PlanStore from '../store/PlanStore';

export const usePlanData = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await PlanStore.fetchPlansAll();
        setPlans(PlanStore.plans || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refetchPlans = useCallback(async () => {
    await PlanStore.fetchPlansAll();
    setPlans(PlanStore.plans || []);
  }, []);

  return { plans, loading, error, refetchPlans };
};