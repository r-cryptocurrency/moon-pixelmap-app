import { useContext, createContext } from "react";
import { BlockInfo } from "../common/types";

type BoardContextType = {
  blocks: BlockInfo[];
  isLoading: boolean;
  setBlocks: (blocks: BlockInfo[]) => void;
  setLoading: (loading: boolean) => void;
  fetchBlocks: () => void;
};

export const BoardContext = createContext<BoardContextType>({
  blocks: [],
  isLoading: false,
  setBlocks: (blocks) => {},
  setLoading: (loadavg: boolean) => {},
  fetchBlocks: () => {},
});

const useBoardContext = () => {
  const context = useContext<BoardContextType>(BoardContext);
  return context;
};

export default useBoardContext;
