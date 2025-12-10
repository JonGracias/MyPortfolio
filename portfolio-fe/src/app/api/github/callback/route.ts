import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return new NextResponse("Missing code", { status: 400 });

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenJson = await tokenRes.json();
  const token = tokenJson.access_token as string | undefined;
  if (!token) return new NextResponse("Token exchange failed", { status: 500 });

  const redirectTo = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = NextResponse.redirect(redirectTo);

  // set cookie on the response
  res.cookies.set("gh_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 6, // 6 hours
  });

  return res;
}
