import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function githubLogin(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return { status: 500, body: "Missing GitHub OAuth environment variables." };
    }

    // generate random state token (mitigates CSRF)
    const state = Math.random().toString(36).slice(2);

    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", "public_repo");
    url.searchParams.set("state", state);

    return {
        status: 302,
        headers: {
            Location: url.toString(),
            "Set-Cookie": `oauth_state=${state}; HttpOnly; Secure; Path=/; SameSite=Lax`
        }
    };
}

app.http("githubLogin", {
    route: "github/login",
    methods: ["GET"],
    authLevel: "anonymous",
    handler: githubLogin
});
