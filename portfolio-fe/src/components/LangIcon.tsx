"use client";

import { useEffect, useState } from "react";
import { useLanguageIcons } from "@/context/LanguageIconContext";

interface LangIconProps {
  lang: string;
  percentText: string;
  size?: number;
}

export default function LangIcon({ lang, percentText }: LangIconProps) {
  const { getIcon } = useLanguageIcons();
  const [status, setStatus] = useState<"loading" | "icon" | "text">("loading");

  const iconUrl = getIcon(lang);

  // Stage progression logic
  useEffect(() => {
    // If icon arrives instantly (cached)
    if (iconUrl) {
      setStatus("icon");
      return;
    }

    // After ~250ms, if still no icon, fallback to text
    const timeout = setTimeout(() => {
      if (!getIcon(lang)) {
        setStatus("text");
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [iconUrl, lang, getIcon]);

  return (
    <div className="relative flex items-center justify-center w-[4rem]">
      <div
        className="
          w-11 h-11 flex items-center justify-center
          rounded-sm
          bg-icon
          backdrop-blur-sm
          pointer-events-none
        "
      >
        {/* Stage 1: Loading shimmer */}
        {status === "loading" && (
          <div className="w-10 h-10 rounded-sm bg-gray-300 dark:bg-gray-600 animate-pulse" />
        )}

        {/* Stage 2: Icon shows */}
        {status === "icon" && iconUrl && (
          <img
            src={iconUrl}
            className="w-10 h-10"
            onError={(e) => {
              e.currentTarget.src = "/icons/unknown.svg";
              setStatus("text");
            }}
          />
        )}

        {/* Stage 3: Text fallback */}
        {status === "text" && (
          <div className="text-[8px] text-red-700 font-bold">{lang}</div>
        )}
      </div>

      <div className="absolute top-10 left-6 w-10 h-8 flex items-center justify-center">
        <span className="relative text-[12px] font-bold text-black dark:text-icon">
          {percentText}
        </span>
      </div>
    </div>
  );
}
