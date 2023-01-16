import React, { createContext, useContext } from "react";

type RedditNameContextType = {
  name: string | undefined;
  setName: (name: string) => void;
  fetchName: () => void;
  alert: boolean;
  setAlert: (alert: boolean) => void;
};

export const RedditNameContext = createContext<RedditNameContextType>({
  name: undefined,
  setName: (name) => {},
  fetchName: () => {},
  alert: false,
  setAlert: (alert) => {},
});

const useRedditNameContext = () => {
  const context = useContext<RedditNameContextType>(RedditNameContext);
  return context;
};

export default useRedditNameContext;
