'use client';

import { createContext, useEffect, useMemo, useState } from 'react';
import { useCurrent, useShow } from '@/app/client-api';
import { CurrentData } from '../types';

const CurrentDataContext = createContext<CurrentData>({});

const REFRESH_CURRENT_INTERVAL = 5000;

function CurrentDataProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentResponse, refreshCurrentResponse] = useCurrent();
  const [current, setCurrent] = useState<CurrentData>();
  const [show] = useShow(
    current?.metadata?.show_id ?? current?.playlist?.show_id,
  );
  const contextValue = useMemo(() => ({ ...current, show }), [current, show]);

  useEffect(() => {
    if (currentResponse) {
      setCurrent(currentResponse);
    }
  }, [currentResponse]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshCurrentResponse();
    }, REFRESH_CURRENT_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [refreshCurrentResponse]);

  return (
    <CurrentDataContext.Provider value={contextValue}>
      {children}
    </CurrentDataContext.Provider>
  );
}

export { CurrentDataProvider, CurrentDataContext };
