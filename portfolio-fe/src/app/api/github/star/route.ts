import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // disable caching

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { owner, repo } = await req.json();

  // Star the repo
  const starRes = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "nextjs-star",
    },
    cache: "no-store",
  });

  if (starRes.status !== 204) {
    return NextResponse.json({ error: await starRes.text() || "GitHub star failed" }, { status: starRes.status });
  }

  // Fetch fresh star count
  const info = await fetch(`https://api.github.com/repos/${owner}/${repo}?t=${Date.now()}`, {
    headers: {
      Accept: "application/vnd.github+json", // Media Types
      "User-Agent": "nextjs-star",           // User Agent
    },
    cache: "no-store",
    next: { revalidate: 0 },
  }).then(r => r.json());

  return NextResponse.json(
    { ok: true, count: info?.stargazers_count ?? null },
    { headers: { "Cache-Control": "no-store" } }
  );
}