"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import MessageShell from "@/components/MessageShell";
import { Repo } from "@/lib/repos";

/* -------------------------------------------------------
 * Types
 * ------------------------------------------------------- */
interface RepoMessage {
  repoName: string;
  content: ReactNode;        // Already wrapped inside MessageShell
}

interface UIContextType {
  hoveredRepo: Repo | null;
  setHoveredRepo: (repo: Repo | null) => void;

  largerRepo: Repo | null;
  setLargerRepo: (repo: Repo | null) => void;

  message: RepoMessage | null;
  setMessage: (repoName: string, content: ReactNode) => void;

  scrolling: boolean;
  setScrolling: (state: boolean) => void;

  clearMessage: () => void;
  clearHoveredRepo: () => void;
  clearLargerRepo: () => void;
  clearAllRepos: () => void;
  isMobile: boolean;  
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
  children: React.ReactNode;
  isMobile: boolean; 
}


/* -------------------------------------------------------
 * Provider
 * ------------------------------------------------------- */
export function UIProvider({ children, isMobile }: UIProviderProps) {
  const [hoveredRepo, _setHoveredRepo] = useState<Repo | null>(null);
  const [largerRepo, _setLargerRepo] = useState<Repo | null>(null);
  
  // The global popup message
  const [message, _setMessage] = useState<RepoMessage | null>(null);

  // Flag used to hide messages temporarily during scrolling
  const [scrolling, setScrolling] = useState<boolean>(false);


  /* -----------------------------------------------------
   * Larger Repos
   * ----------------------------------------------------- */
  const setLargerRepo = useCallback((repo: Repo | null) => {
    clearHoveredRepo();
    _setLargerRepo(repo);
  }, []);
  const clearLargerRepo = useCallback(() => {
    _setLargerRepo(null);
  }, []);
  /* -----------------------------------------------------
   * Message Controls
   * ----------------------------------------------------- */
  const clearMessage = useCallback(() => {
    _setMessage(null);
  }, []);

  const setMessage = useCallback(
    (repoName: string, content: ReactNode) => {
      _setMessage({
        repoName,
        content: (
          <MessageShell onClose={clearMessage}>
            {content}
          </MessageShell>
        ),
      });
    },
    [clearMessage]
  );

  /* -----------------------------------------------------
   * Hover Controls
   * ----------------------------------------------------- */
  const setHoveredRepo = useCallback((repo: Repo | null) => {
    _setHoveredRepo(repo);
  }, []);

  const clearHoveredRepo = useCallback(() => {
    _setHoveredRepo(null);
  }, []);


  const clearAllRepos = useCallback(() => {
    clearHoveredRepo();
    clearLargerRepo();
  }, []);

  /* -----------------------------------------------------
   * Provider Value
   * ----------------------------------------------------- */
  return (
    <UIContext.Provider
      value={{
        hoveredRepo,
        setHoveredRepo,

        largerRepo,
        setLargerRepo,
        
        message,
        setMessage,
        
        scrolling,
        setScrolling,
        
        clearMessage,
        clearHoveredRepo,
        clearLargerRepo,
        clearAllRepos,
        
        isMobile
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

/* -------------------------------------------------------
 * Hook
 * ------------------------------------------------------- */
export function useUIContext() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUIContext must be used inside UIProvider");
  }
  return ctx;
}
