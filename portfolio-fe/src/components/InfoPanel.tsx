"use client";

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";
import { Repo } from "@/lib/repos";
import { useUIContext } from "@/context/UIContext";

interface Props {
  repo: Repo;
  isActive: boolean;
  isLarge?: boolean
}

export interface RepoCardHandle {
  startAutoScroll: () => void;
  stopAutoScroll: () => void;
  getScrollElement: () => HTMLParagraphElement | null;
}


const InfoPanel = forwardRef<RepoCardHandle, Props>(
  ({ repo,  isActive, isLarge=false }, ref) => {
    const descRef = useRef<HTMLParagraphElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const {
      setLargerRepo,
    } = useUIContext();
    
    // -----------------------------------------------------
    // STOP AUTO SCROLL
    // -----------------------------------------------------
    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // -----------------------------------------------------
    // START AUTO SCROLL (with layout delay fix)
    // -----------------------------------------------------
    const startAutoScroll = () => {
      const el = descRef.current;
      if (!el) return;

      stopAutoScroll();

      setTimeout(() => {
        const el = descRef.current;
        if (!el) return;

        if (el.scrollHeight <= el.clientHeight) return;

        intervalRef.current = setInterval(() => {
          if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
            stopAutoScroll();
            return;
          }
          el.scrollTop += 1;
        }, 80);
      }, 20);
    };

    useImperativeHandle(ref, () => ({
      startAutoScroll,
      stopAutoScroll,
      getScrollElement: () => descRef.current,
    }));

    useEffect(() => {
      return () => stopAutoScroll();
    }, []);

    const formattedDate = new Date(
      repo.updated_at
    ).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    function handleClick(repo: Repo) {
      console.log("Pushed button")
      setLargerRepo(repo)
    }

    
    const large = isLarge && isActive;

    return (
      <button
        onClick={()=>handleClick(repo)}
        className={[
          "group flex flex-col text-left cursor-pointer select-none",
          "overflow-hidden",
          "bg-white dark:bg-neutral-900",
          large ? "p-4 gap-3 h-full w-full" : "p-3 pb-2 pt-1 w-[13rem]",
        ].join(" ")}
      >
        {/* Title */}
        <h1
          className={[
            "font-bold text-blue-800 dark:text-blue-400 tracking-tight",
            "w-full overflow-hidden whitespace-nowrap truncate",
            large ? "text-2xl" : "text-xl",
          ].join(" ")}
        >
          {repo.name.replace(/(^\w|\s\w)/g, (c) => c.toUpperCase())}
        </h1>

        {/* Updated Date */}
        <div
          className="
            text-[11px] uppercase tracking-wide
            text-gray-500 dark:text-gray-400
            mt-1
          "
        >
          Updated {formattedDate}
        </div>

        {/* Description */}
        <p
          ref={descRef}
          className={[
            "text-gray-600 dark:text-gray-300",
            "overflow-y-auto overflow-x-hidden",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "transition-opacity duration-200 ease-out",
            "mt-2 pr-1",

            // typography + sizing
            large
              ? "flex-1 text-base leading-6 opacity-90"
              : "h-[3.5rem] text-sm leading-5 opacity-70 group-hover:opacity-100",
          ].join(" ")}
        >
          {repo.description ?? "No description available."}
        </p>
      </button>
    );
  }
);

export default memo(InfoPanel);
