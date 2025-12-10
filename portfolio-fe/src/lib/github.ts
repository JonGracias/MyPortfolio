

export async function fetchRepos() {
  const user = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE  || "";
  console.log(process.env.NEXT_PUBLIC_API_BASE)

  const res = await fetch(`${apiBase}/api/github/repos`);
  const data = await res.json();

  // ----------------------------------------------------------
  //  Fetch languages + README for each repo in parallel
  // ----------------------------------------------------------
  const repos = await Promise.all(
    data.map(async (r: any) => {
      let languages: Record<string, number> = {};
      let readme: string | null = null;

      //
      // ─── LANGUAGES ───────────────────────────────────────────
      //
      try {
        const langRes = await fetch(r.languages_url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (langRes.ok) languages = await langRes.json();
      } catch (err) {
        console.warn(`Failed to fetch languages for ${r.name}`, err);
      }

      //
      // ─── README FETCH ─────────────────────────────────────────
      // GitHub returns base64 content in the `content` field.
      //
      try {
        const readmeRes = await fetch(
          `https://api.github.com/repos/${user}/${r.name}/readme`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        if (readmeRes.ok) {
          const readmeJson = await readmeRes.json();
          if (readmeJson.content) {
            const buff = Buffer.from(readmeJson.content, "base64");
            readme = buff.toString("utf-8");
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch README for ${r.name}`, err);
      }

      //
      // ─── RETURN MAPPED REPO ───────────────────────────────────
      //
      return {
        id: r.id,
        name: r.name,
        html_url: r.html_url,
        description: r.description,
        stargazers_count: r.stargazers_count,

        language: r.language,
        languages,

        forks_count: r.forks_count,
        open_issues_count: r.open_issues_count,

        owner: r.owner?.login ?? "",

        created_at: r.created_at,
        pushed_at: r.pushed_at,
        updated_at: r.updated_at,

        readme,
      };
    })
  );

  return repos;
}
