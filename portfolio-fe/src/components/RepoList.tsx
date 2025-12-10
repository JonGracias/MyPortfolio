"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import RepoCard from "./RepoCard";
import RepoFilters from "./RepoFilters";
import Popup from "./Popup";
import { useRepoContext } from "@/context/RepoContext";
import { useUIContext } from "@/context/UIContext";
import LargeRepoCard from "./LargeRepoCard";
import type { Position, Repo } from "@/lib/repos";

export default function RepoList() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const defaultPos: Position = { top: 0, left: 0, height: 0, width: 0, scale: 0, };
  const [hoverPos, setHoverPos] = useState<Position>(defaultPos);
  const [messagePos, setMessagePos] = useState<Position>(defaultPos);
  const [largerPos, setLargerPos] = useState<Position>(defaultPos);
  const { visibleRepos } = useRepoContext();

  const {
    hoveredRepo,
    setHoveredRepo,
    scrolling,
    setScrolling,
    message,
    clearMessage,
    clearHoveredRepo,
    isMobile,
    largerRepo,
    setLargerRepo
  } = useUIContext();
  
  // Reactive window width
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* -----------------------------------------------------------
   * Popup Position Calculation (Single Source of Truth)
   * ----------------------------------------------------------- */
  const largeRepoPosition = useCallback(
    (rect: DOMRect) => {
      const mainContainerRect =
        mainContainerRef.current?.getBoundingClientRect();

      if (!mainContainerRect) return defaultPos;

      const mobileTop = mainContainerRect.top;
      const mobileLeft = mainContainerRect.left;
      const mobileHeight = mainContainerRect.height;
      const mobileWidth = mainContainerRect.width;
      const scale = 1;

      // ---------------------------------------
      // Larger Position
      // ---------------------------------------
      let top = mobileTop;
      let left = mobileLeft - 16;
      let height = mobileHeight;
      let width = mobileWidth;

      return { top, left, height, width, scale };
    },[scrollContainerRef, windowWidth]);

  const computePopupPosition = useCallback(
    (rect: DOMRect) => {
      const scrollContainerRect =
        scrollContainerRef.current?.getBoundingClientRect();
      const mainContainerRect =
        mainContainerRef.current?.getBoundingClientRect();

      if (!scrollContainerRect || !mainContainerRect) return defaultPos;

      const myRem = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      const scrollTop = scrollContainerRect.top;
      const scrollBottom = scrollContainerRect.bottom;

      // ---------------------------------------
      // Desktop Defaults
      // ---------------------------------------
      let scale = 1;
      let height = myRem * 16;
      let width = myRem * 16;

      let left = rect.left - 32;
      let top = rect.top - 16;

      // ---------------------------------------
      // Vertical Clamp
      // ---------------------------------------
      const minTop = scrollTop;
      if (top < minTop) top = minTop;

      const maxBottom = scrollBottom + 20;
      if (top + height > maxBottom) {
        top = maxBottom - height;
      }

      return { top, left, height, width, scale };
    },
    [scrollContainerRef, windowWidth]
  );



  /* -----------------------------------------------------------
   * Hover Logic
   * ----------------------------------------------------------- */
  const handleMouseEnter = useCallback(
    (element: HTMLDivElement, repo: Repo) => {
      if (isMobile) {
        setLargerRepo(repo);
      }
      setHoveredRepo(repo);


      const rect = element.getBoundingClientRect();
      const lpos = largeRepoPosition(rect);
      const pos = computePopupPosition(rect);

      setHoverPos(pos);
      setMessagePos({ ...pos });
      setLargerPos({ ...lpos });
    },
    [setHoveredRepo, computePopupPosition]
  );

  const handleMouseLeave = useCallback(() => {
    clearHoveredRepo();
    clearMessage();
  }, [clearHoveredRepo, clearMessage]);

  /* -----------------------------------------------------------
   * Scroll Behavior: Hide popups during scroll
   * ----------------------------------------------------------- */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let timeout: NodeJS.Timeout;

    const onScroll = () => {
      setScrolling(true);
      clearHoveredRepo();
      clearMessage();

      clearTimeout(timeout);
      timeout = setTimeout(() => setScrolling(false), 150);
    };

    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, [setScrolling, clearHoveredRepo, clearMessage]);


  /* -----------------------------------------------------------
   * RENDER
   * ----------------------------------------------------------- */
  return (
    <div onMouseLeave={handleMouseLeave} 
        ref={mainContainerRef}
        className="
          relative flex flex-col h-full shadow-md rounded-xl
          bg-gray-100 dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          w-[19.1rem] md:w-[32rem] lg:w-[50rem] xl:w-[65rem]
          [height:calc(100dvh-18rem)]
          min-h-[18rem]
          max-h-[90rem]">

      <div className="Large_Card absolute inset-0">
        {/* Large Repo Popup */}
        {largerRepo && (
          <LargeRepoCard repo={largerRepo} position={largerPos}/>
        )}
        {/* Mobile Popup */}
        {isMobile && largerRepo && (
          <LargeRepoCard repo={largerRepo} position={largerPos}/>
        )}
      </div>

      <div className="Popup_card" onMouseLeave={handleMouseLeave}>
        {/* Hover Popup */}
        {!scrolling && !largerRepo && hoveredRepo && (
          <div className="">
            <Popup object={<RepoCard repo={hoveredRepo} />} position={hoverPos} />
          </div>
        )}
        {/* Message */}
        {message && hoveredRepo && message.repoName === hoveredRepo.name && (
          <Popup object = {message.content} position={messagePos}/>
        )}

      </div>
      {/* Filters */}
        <RepoFilters />
      <div
        ref={scrollContainerRef}
        className="
          scroll-container
          flex-1
          overflow-y-auto overflow-x-hidden
          custom-scrollbar
          flex flex-col items-center justify-start">
        {/* Grid */}
        <div
        ref={gridContainerRef}
          className="
            grid gap-5
            grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
            auto-rows-[14rem]
            [grid-template-columns:repeat(auto-fill,_14rem)]
            isolate
            px-5 py-10">
          {visibleRepos.map((repo) => (
            <div
              key={repo.id}
              onMouseEnter={(e) => handleMouseEnter(e.currentTarget, repo)}
              className="relative h-[14rem] w-[14rem]">
              <div className="pointer-events-none">
                <RepoCard repo={repo} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
