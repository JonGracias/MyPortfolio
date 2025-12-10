"use client";

import React from "react";
import LangIcon  from "./LangIcon"; 
import type { Filters } from "@/lib/filters";

interface Props {
    langMap: Record<string, number>;
    clearHoveredRepo: () => void;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function LanguageEntries({ langMap, clearHoveredRepo, setFilters }: Props) {

    const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0);
    const keys = Object.keys(langMap);
    if (keys.length === 0) return null;

    const entries = keys.map((lang) => {
        const bytes = langMap[lang];
        return (
            <button
                key={lang}
                className={[
                "flex flex-col items-center justify-center",
                "border border-white dark:border-neutral-900",
                "hover:border-blue-400 dark:hover:border-orange-400",
                "rounded-md text-sm h-[3.3rem] w-[3.3rem]"
                ].join(" ")}
                onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearHoveredRepo();
                setFilters((f) => ({ ...f, language: lang }));
                }}
            >
                <LangIcon lang={lang} percentText={percent(bytes)} />
            </button>
        );
    });

    return (
        <section className="w-full h-full">
        <div className="w-full h-full px-5 grid grid-cols-2 gap-10">
            {entries}
        </div>
        </section>
    );
    /* ────────────────────────────────────────────────
        Robust percent()
    ───────────────────────────────────────────────── */
    function percent(bytes: number | undefined) {
    if (!totalBytes || !bytes) return "0%";
    return ((bytes / totalBytes) * 100).toFixed(1) + "%";
    }
}

