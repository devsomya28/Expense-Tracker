import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSubscriptionData } from '../api/subscription';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSub = async () => {
    try {
      if (user) {
        const res = await getSubscriptionData();
        if (res.success) setSubData(res);
      } else {
        setSubData(null);
      }
    } catch (err) {
      console.error("Sub fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSub(); }, [user]);

  const hasFeature = (feature) => subData?.subscription?.features?.includes(feature);

  return (
    <SubscriptionContext.Provider value={{ subData, loading, hasFeature, refreshSub: fetchSub }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);