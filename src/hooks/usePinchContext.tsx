import { useContext, createContext } from "react";

type PinchContextType = {
  startDistance: number;
  startSize: number;
  setStartDistance: (distance: number) => void;
  setStartSize: (size: number) => void;
};

export const PinchContext = createContext<PinchContextType>({
  startDistance: 0,
  startSize: 0,
  setStartDistance: (distance) => {},
  setStartSize: (size) => {},
});

const usePinchContext = () => {
  const context = useContext<PinchContextType>(PinchContext);
  return context;
};

export default usePinchContext;
