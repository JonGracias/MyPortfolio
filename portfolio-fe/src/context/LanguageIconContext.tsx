"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode
} from "react";

import { getLanguageIconUrl } from "@/utils/getLanguageIconUrl";
import { useRepoContext } from "@/context/RepoContext";

type Cache = Record<string, string>;

interface LanguageIconContextType {
  getIcon: (lang: string) => string | null;
  loadIcons: (langs: string[]) => void;
}

const LanguageIconContext = createContext<LanguageIconContextType | null>(null);

// --------------------------------------------------
// Utility: Check first working URL using HEAD
// --------------------------------------------------
async function findFirstWorkingUrl(urls: (string | null)[]) {
  for (const url of urls) {
    if (!url) continue;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return url;
    } catch {}
  }
  return null;
}

// --------------------------------------------------
// Provider
// --------------------------------------------------
export function LanguageIconProvider({ children }: { children: ReactNode }) {
  const { languages } = useRepoContext();
  const [cache, setCache] = useState<Cache>({});

  const loadIcons = useCallback(async (langs: string[]) => {
    const missing = langs.filter(
      (l) => !cache[l] && !localStorage.getItem(`icon:${l}`)
    );
    if (missing.length === 0) return;
  
    const results = await Promise.all(
      missing.map(async (lang) => {
        const urls = getLanguageIconUrl(lang);
        const resolved = await findFirstWorkingUrl(urls);
        const finalUrl = resolved ?? "/icons/unknown.svg";
  
        try {
          localStorage.setItem(`icon:${lang}`, finalUrl);
        } catch {}
  
        return [lang, finalUrl] as const;
      })
    );
  
    const update = Object.fromEntries(results);
    setCache((prev) => ({ ...prev, ...update }));
  }, [cache]);
    
  useEffect(() => {
    if (languages.length > 0) {
      loadIcons(languages);
    }
  }, [languages, loadIcons]);




  // Get icon for a single language
  const getIcon = useCallback(
    (lang: string) => {
      if (typeof window === "undefined") return cache[lang] ?? null;
      return cache[lang] ?? localStorage.getItem(`icon:${lang}`) ?? null;
    },
    [cache]
  );

  const value = useMemo(
    () => ({ getIcon, loadIcons }),
    [getIcon, loadIcons]
  );

  return (
    <LanguageIconContext.Provider value={value}>
      {children}
    </LanguageIconContext.Provider>
  );
}

// --------------------------------------------------
// Consumer Hook
// --------------------------------------------------
export function useLanguageIcons() {
  const ctx = useContext(LanguageIconContext);
  if (!ctx) throw new Error("useLanguageIconContext must be used inside provider");
  return ctx;
}
