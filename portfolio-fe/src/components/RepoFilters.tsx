"use client";
import { useRepoContext } from "@/context/RepoContext";

export default function RepoFilters() {
  const { filters, setFilters, languages } = useRepoContext();

  return (
    <div
      className="
        sticky top-0 z-10 
        bg-gray-100/90 dark:bg-gray-800/90 
        backdrop-blur 
        border-b border-gray-300 dark:border-gray-700
        px-4 py-3 rounded-t-2xl 
        flex flex-wrap items-center 
        gap-x-5 gap-y-2 
      "
    >
      {/* Language Filter */}
      <div>
        <label className="text-sm font-medium">Language:</label>
        <select
          value={filters.language}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, language: e.target.value }))
          }
          className="
            px-2 py-1 rounded-lg
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-neutral-900
            text-sm
          "
        >
          {/* Always show the “All” option */}
          <option value="All">All</option>

          {/* Now show real languages */}
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Filter */}
      <div>
        <label className="ml-2 text-sm font-medium">Sort:</label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sortBy: e.target.value as typeof prev.sortBy,
            }))
          }

          className="
            px-2 py-1 rounded-lg 
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-neutral-900 
            text-sm
          "
        >
          <option value="stars">Most Stars</option>
          <option value="created">Date Created</option>
          <option value="activity">Most Activity</option>
          <option value="updated">Last Updated</option>
        </select>
      </div>
    </div>
  );
}
