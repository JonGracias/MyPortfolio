"use client";

import { useRepoContext } from "@/context/RepoContext";
import { Repo } from "@/lib/repos";
import { useUIContext } from "@/context/UIContext";
import LanguageEntries from "./LanguageEntries";
import LangIcon from "./LangIcon";

export default function LanguageDisplay({ repo }: { repo: Repo }) {
  const { setFilters, displayLanguage } = useRepoContext();
  const { setMessage, clearHoveredRepo } = useUIContext();

  const langMap = repo.languages ?? {};
  const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0);

  const primaryLanguage = displayLanguage[repo.name] ?? "Unknown";

  /* ────────────────────────────────────────────────
     Robust percent()
  ───────────────────────────────────────────────── */
  function percent(bytes: number | undefined) {
    if (!totalBytes || !bytes) return "0%";
    return ((bytes / totalBytes) * 100).toFixed(1) + "%";
  }

  /* ────────────────────────────────────────────────
     CLICK → OPEN OVERLAY OF LANGS
  ───────────────────────────────────────────────── */
  function handleClick() {
    setMessage(
      repo.name,
      <LanguageEntries
        langMap={langMap}
        clearHoveredRepo={clearHoveredRepo}
        setFilters={setFilters}
      />
    );
  }

  /* ────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────── */
  return (
    <button
      onClick={handleClick}
      className="overflow-visible w-[4rem] h-[4rem] flex items-center justify-center cursor-pointer"
    >
      <LangIcon
        lang={primaryLanguage}
        percentText={percent(langMap[primaryLanguage])}
      />
    </button>
  );
}
