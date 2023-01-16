import { useContext, createContext } from "react";

type TxLoadingContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const TxLoadingContext = createContext<TxLoadingContextType>({
  open: false,
  setOpen: (open) => {},
});

const useTxLoadingContext = () => {
  const context = useContext<TxLoadingContextType>(TxLoadingContext);
  return context;
};

export default useTxLoadingContext;
