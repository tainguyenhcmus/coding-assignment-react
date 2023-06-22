import React, { createContext, useContext } from 'react';
import useSWR from 'swr';

const SWRContext = createContext();

export const SWRProvider = ({ children }) => {
  // Fetcher function to be used by SWR
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const value = {
    useSWR: (url) => useSWR(url, fetcher),
  };

  return <SWRContext.Provider value={value}>{children}</SWRContext.Provider>;
};

export const useSWRContext = () => useContext(SWRContext);