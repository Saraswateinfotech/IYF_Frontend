"use client"
import { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }) => {
  const [updateFlag, setUpdateFlag] = useState(false);

  const triggerUpdate = () => {
    setUpdateFlag(prev => !prev);  
  };

  return (
    <DashboardContext.Provider value={{ updateFlag, triggerUpdate }}>
      {children}
    </DashboardContext.Provider>
  );
};
