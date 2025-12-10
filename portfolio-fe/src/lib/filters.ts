export type SortOption = "created" | "updated" | "stars" | "activity";

export interface Filters {
  language: string;
  sortBy: SortOption;
}