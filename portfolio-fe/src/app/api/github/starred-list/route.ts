// src/app/api/github/starred-list/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = (await cookies()).get("gh_token")?.value;

    if (!token) {
      return NextResponse.json({ authed: false, repos: [] }, { status: 401 });
    }

    const gh = await fetch("https://api.github.com/user/starred", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "nextjs-starred-list",
      },
      cache: "no-store",
    });

    if (!gh.ok) {
      console.error("GitHub starred-list error:", gh.status);
      return NextResponse.json({ authed: false, repos: [] }, { status: gh.status });
    }

    const repos = await gh.json();
    return NextResponse.json({ authed: true, repos });
  } catch (err: any) {
    console.error("GitHub API error:", err);
    return NextResponse.json(
      { authed: false, repos: [], error: err.message || "Network error" },
      { status: 500 }
    );
  }
}
