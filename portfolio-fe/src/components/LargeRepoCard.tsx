"use client";

import { useRef, memo } from "react";
import StarButton from "./StarButton";
import GitHubButton from "./GitHubButton";
import { useUIContext } from "@/context/UIContext";
import InfoPanel, { RepoCardHandle } from "./InfoPanel";
import LanguageEntries from "./LanguageEntries";
import { useRepoContext } from "@/context/RepoContext";
import GHReadMe from "./GHReadMe";
import type { Position, RepoCardProps } from "@/lib/repos";

const DEFAULT_POS: Position = {
  top: 0,
  left: 0,
  height: 0,
  width: 0,
  scale: 1,
};

export default memo(function LargeRepoCard({
  repo,
  position = {},
}: RepoCardProps) {
  const finalPos: Position = { ...DEFAULT_POS, ...position };
  const infoRef = useRef<RepoCardHandle>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    isMobile,
    largerRepo,
    clearAllRepos,
    clearHoveredRepo,
    clearMessage
  } = useUIContext();
  const { setFilters } = useRepoContext();
  const isActive = largerRepo?.name === repo.name;

  // Language map and derived stats
  const langMap = repo.languages ?? {};
  const buttonClass = [
    "h-[3.5rem] w-full",
    "flex items-center justify-center",
    "rounded-lg",
    "border border-white dark:border-neutral-900",
    "hover:border-blue-400 dark:hover:border-orange-400",
  ].join(" ");
  

  return (
    <section
      ref={cardRef}
      className={[
        "LargeRepoCard",
        "fixed z-[20]",
        "group rounded-xl shadow-sm",
        "bg-white dark:bg-neutral-900",
        "transition-transform duration-200 ease-out",
        "p-4",
        "flex flex-col",
        "min-h-[14rem] min-w-[14rem]",
        "overflow-x-hidden overflow-y-auto",
        "custom-scrollbar"
      ].join(" ")}
      style={{
        width: finalPos.width,
        height: finalPos.height,
      }}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearAllRepos();
        }}
        className="
          absolute top-2 right-2
          w-7 h-7 flex items-center justify-center
          rounded-full bg-neutral-800 text-white 
          dark:bg-neutral-700 shadow-md 
          text-sm font-bold z-[20]
        "
        aria-label="Close details"
      >
        X
      </button>

      {/* Top: Info panel */}
      <div className="flex-shrink-0">
        <InfoPanel
          ref={infoRef}
          repo={repo}
          isActive={isActive}
          isLarge={true}
        />
      </div>

      {/* Middle: buttons + quick stats */}
      <div className="mt-3 flex flex-col gap-3 ">
            {/* Button row */}
            <div className="
                    w-full
                    grid grid-cols-2 items-center gap-2
                    auto-rows-[8rem]
                    [grid-template-columns:repeat(auto-fill,_8rem)]
                    flex items-center justify-center">
                <section className={buttonClass}>
                    <GitHubButton repo={repo} />
                </section>

                <section className={buttonClass}>
                    <StarButton repo={repo} />
                </section>
            </div>
        </div>
        {/* Tech summary */}
        <section className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="sm:col-span-2">
            <div className="uppercase text-[11px] font-semibold tracking-wide text-gray-500 dark:text-gray-400">
              Languages breakdown
            </div>
            <div className="mt-1">
              <LanguageEntries
                langMap={langMap}
                clearHoveredRepo={clearAllRepos}
                setFilters={setFilters}
              />
            </div>
          </div>
        </section>


      {/* Bottom: README preview fills the remaining space */}
      <GHReadMe repo={repo} />
    </section>
  );
});
