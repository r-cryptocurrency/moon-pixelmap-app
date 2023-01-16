import React, { createContext, useContext } from "react";

type EditBlockModalContextType = {
  open: boolean;
  x: number;
  y: number;
  setOpen: ({ x, y, open }: { x: number; y: number; open: boolean }) => void;
};

export const EditBlockModalContext = createContext<EditBlockModalContextType>({
  open: false,
  x: 0,
  y: 0,
  setOpen: ({ x, y, open }) => {},
});

const useEditBlockModal = () => {
  const context = useContext<EditBlockModalContextType>(EditBlockModalContext);
  return context;
};

export default useEditBlockModal;
