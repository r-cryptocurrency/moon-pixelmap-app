import { useContext, createContext } from "react";

type BatchContextType = {
  mode: number;
  batches: { x: number; y: number }[];
  setBatches: (batch: { x: number; y: number }[]) => void;
  setMode: (mod: number) => void;
};

export const BatchContext = createContext<BatchContextType>({
  mode: 0,
  batches: [],
  setBatches: (batch) => {},
  setMode: (mode) => {},
});

const useBatchContext = () => {
  const context = useContext<BatchContextType>(BatchContext);
  return context;
};

export default useBatchContext;
