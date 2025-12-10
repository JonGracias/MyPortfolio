"use client";

import { useEffect, useRef, memo } from "react";
import LanguageDisplay from "./LanguageDisplay";
import StarButton from "./StarButton";
import GitHubButton from "./GitHubButton";
import { useUIContext } from "@/context/UIContext";
import InfoPanel, { RepoCardHandle } from "./InfoPanel";
import type { Position, RepoCardProps  } from "@/lib/repos";

const DEFAULT_POS: Position = {
  top: 0,
  left: 0,
  height: 0,
  width: 0,
  scale: 1,
};

export default memo(function RepoCard({
  repo,
  position = {},
}: RepoCardProps) {
  const finalPos: Position = { ...DEFAULT_POS, ...position };
  const infoRef = useRef<RepoCardHandle>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    isMobile,
    hoveredRepo,
  } = useUIContext();
  const isActive = hoveredRepo?.name === repo.name;

  function handleEnter() {
    const el = infoRef.current?.getScrollElement?.();

    if (el && el.scrollHeight > el.clientHeight) {
      infoRef.current?.startAutoScroll();
    }
  }

  function handleLeave() {
    const el = infoRef.current?.getScrollElement?.();

    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    }

    infoRef.current?.stopAutoScroll();
  }

  //
  // ────────────────────────────────────────────────────────────────
  // Popup wheel scroll forwarding (NO document.getElementById)
  // ────────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    const card = cardRef.current;
    if (!card || isMobile) return;

    const forwardWheel = (e: WheelEvent) => {
      e.preventDefault();
      const container = document.querySelector(".scroll-container");
      if (container) {
        container.scrollBy({ top: e.deltaY, behavior: "smooth" });
      }
    };

    // Only enable when card is inside popup container
    if (card.closest("#popup-card")) {
      card.addEventListener("wheel", forwardWheel, { passive: false });
      return () => card.removeEventListener("wheel", forwardWheel);
    }
  }, [isMobile]);

  const buttonClass = [
    "h-[3.5rem] w-full",
    "flex items-center justify-center",
    "rounded-lg m-",
    "border border-white dark:border-neutral-900",
    "hover:border-blue-400 dark:hover:border-orange-400",
  ].join(" ");


  //
  // ────────────────────────────────────────────────────────────────
  // Component
  // ────────────────────────────────────────────────────────────────
  //
  return (
    <section
      onMouseEnter={isMobile ? undefined : handleEnter}
      onMouseLeave={isMobile ? undefined : handleLeave}
      ref={cardRef}
      className={[
        "RepoCard",
        "group block rounded-xl shadow-sm",
        "bg-white dark:bg-neutral-900",
        "transition-transform duration-200 ease-out",
        "p-4 relative",
        "w-full",
        "flex flex-col min-h-[14rem] min-w-[14rem]",
      ].join(" ")}
      style={{
        top: finalPos.top,
        left: finalPos.left,
        width: finalPos.width,
        height: finalPos.height,
      }}>
        
      {/* CLICKABLE INFO PANEL */}
      <InfoPanel
        ref={infoRef}
        repo={repo}
        isActive={isActive}
        isLarge={false}   
      />

      {/* BUTTON ROW */}
      <div className="grid grid-cols-3 items-center justify-center mt-2 gap-2">
        <section className={buttonClass}>
          <GitHubButton repo={repo} />
        </section>

        <section className={buttonClass}>
          <LanguageDisplay repo={repo} />
        </section>

        <section className={buttonClass}>
          <StarButton repo={repo} />
        </section>
      </div>
    </section>
  );
});
