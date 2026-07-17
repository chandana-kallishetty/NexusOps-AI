import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type DrillDownType = 'revenue' | 'inventory' | 'risk' | 'profit' | 'delivery' | 'supplier' | null;

interface DrillDownContextType {
  isOpen: boolean;
  type: DrillDownType;
  openDrillDown: (type: DrillDownType) => void;
  closeDrillDown: () => void;
}

const DrillDownContext = createContext<DrillDownContextType | undefined>(undefined);

export function DrillDownProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<DrillDownType>(null);

  const openDrillDown = (newType: DrillDownType) => {
    setType(newType);
    setIsOpen(true);
  };

  const closeDrillDown = () => {
    setIsOpen(false);
    setTimeout(() => setType(null), 300); // clear after animation
  };

  return (
    <DrillDownContext.Provider value={{ isOpen, type, openDrillDown, closeDrillDown }}>
      {children}
    </DrillDownContext.Provider>
  );
}

export function useDrillDown() {
  const context = useContext(DrillDownContext);
  if (context === undefined) {
    throw new Error('useDrillDown must be used within a DrillDownProvider');
  }
  return context;
}
