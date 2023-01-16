import { useContext, createContext } from "react";

type PixelSizeContextType = {
  size: number;
  setSize: (size: number) => void;
};

export const PixelSizeContext = createContext<PixelSizeContextType>({
  size: 10,
  setSize: (size) => {},
});

const usePixelSizeContext = () => {
  const context = useContext<PixelSizeContextType>(PixelSizeContext);
  return context;
};

export default usePixelSizeContext;
