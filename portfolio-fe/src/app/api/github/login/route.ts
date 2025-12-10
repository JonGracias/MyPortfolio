import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID!;
  const redirect = new URL("https://github.com/login/oauth/authorize");
  redirect.searchParams.set("client_id", clientId);
  redirect.searchParams.set("scope", "public_repo");
  redirect.searchParams.set("state", Math.random().toString(36).slice(2));
  return NextResponse.redirect(redirect.toString());
}
