import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function githubCallback(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookie = req.headers.get("cookie") || "";

    const storedState = cookie.match(/oauth_state=([^;]+)/)?.[1];

    if (!code || !state) {
        return { status: 400, body: "Missing OAuth code or state." };
    }

    if (state !== storedState) {
        return { status: 400, body: "Invalid OAuth state." };
    }

    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri
        })
    });

    const tokenJson = await tokenRes.json();

    if (!tokenJson.access_token) {
        context.error("Failed to exchange GitHub token", tokenJson);
        return { status: 500, body: "GitHub OAuth token exchange failed" };
    }

    const accessToken = tokenJson.access_token;

    return {
        status: 302,
        headers: {
            Location: "http://localhost:3000", // redirect frontend after login
            "Set-Cookie": `gh_token=${accessToken}; HttpOnly; Secure; Path=/; SameSite=Lax`
        }
    };
}

app.http("githubCallback", {
    route: "github/callback",
    methods: ["GET"],
    authLevel: "anonymous",
    handler: githubCallback
});

