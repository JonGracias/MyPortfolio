export type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  languages: Record<string, number>
  languages_abv: Record<string, number> 
  forks_count: number;
  open_issues_count: number;
  owner: string;
  created_at: string;
  pushed_at: string;
  updated_at: string;
  launchUrl?: string | null;
  readme?: string | null;
};

export type Position = {
  top: number;
  left: number;
  height: number;
  width: number;
  scale: number;
};
export type RepoCardProps = {
  repo: Repo;
  position?: Partial<Position>;
};