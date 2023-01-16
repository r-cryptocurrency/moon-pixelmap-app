import React, { createContext, useContext } from "react";

type WalletModalContextType = {
  mode: number;
  setMode: (mode: number) => void;
};

export const WalletModalContext = createContext<WalletModalContextType>({
  mode: 0,
  setMode: (mode) => {},
});

const useWalletModal = () => {
  const context = useContext<WalletModalContextType>(WalletModalContext);
  return context;
};

export default useWalletModal;
