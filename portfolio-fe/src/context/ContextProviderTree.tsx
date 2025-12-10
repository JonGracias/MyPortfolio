"use client";

import { RepoProvider } from "./RepoContext";
import { UIProvider } from "./UIContext";
import { LanguageIconProvider } from "./LanguageIconContext";
import { StarProvider } from "./StarContext";
import { Repo } from "@/lib/repos";

interface ContextProviderTreeProps {
  repos: Repo[];
  isMobile: boolean;
  children: React.ReactNode;
}

/**
 * Global context provider order:
 * 1. RepoProvider – loads repos, extracts languages, star data, filters, etc.
 * 2. UIProvider – manages global UI state (hover, message shell, scrolling).
 * 3. LanguageIconProvider – uses RepoContext to load icons for languages.
 */
export default function ContextProviderTree({ repos, isMobile, children }: ContextProviderTreeProps) {
  return (
    <RepoProvider repos={repos}>
      <UIProvider isMobile={isMobile}>
        <LanguageIconProvider>
          <StarProvider>
            {children}
          </StarProvider>
        </LanguageIconProvider>
      </UIProvider>
    </RepoProvider>
  );
}
