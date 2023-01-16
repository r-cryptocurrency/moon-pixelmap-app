import React, { createContext, useContext } from "react";

type BlackListContextType = {
  blacks: number[];
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchBlacks: () => void;
  setBlacks: (blacks: number[]) => void;
};

export const BlackListContext = createContext<BlackListContextType>({
  blacks: [],
  open: false,
  setOpen: (open) => {},
  fetchBlacks: () => {},
  setBlacks: (blacks) => {},
});

const useBlackList = () => {
  const context = useContext<BlackListContextType>(BlackListContext);
  return context;
};

export default useBlackList;
