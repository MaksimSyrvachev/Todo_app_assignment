"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Dispatch,
  SetStateAction,
  type PropsWithChildren,
  createContext,
  useState,
} from "react";

type ContextLastIdStateType = [number, Dispatch<SetStateAction<number>>];

export const LastIdContext = createContext<ContextLastIdStateType>(
  undefined as never
);

const queryClient = new QueryClient();

const Providers = ({ children }: PropsWithChildren) => {
  const lastIdState: ContextLastIdStateType = useState(0);
  return (
    <LastIdContext.Provider value={lastIdState}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </LastIdContext.Provider>
  );
};

export default Providers;
