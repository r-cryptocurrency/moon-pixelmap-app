import { useContext, createContext } from "react";

type ViewBlockContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ViewBlockContext = createContext<ViewBlockContextType>({
  open: false,
  setOpen: (open) => {},
});

const useViewBlockContext = () => {
  const context = useContext<ViewBlockContextType>(ViewBlockContext);
  return context;
};

export default useViewBlockContext;
