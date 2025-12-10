import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Utility: parse cookies header into key/value map
function parseCookies(cookieHeader: string | null): Record<string, string> {
    if (!cookieHeader) return {};
    return Object.fromEntries(
        cookieHeader.split(";").map((c) => {
            const [key, val] = c.trim().split("=");
            return [key, decodeURIComponent(val)];
        })
    );
}

export async function githubStar(
    req: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {

    context.log("Star repo request", req.url);

    //
    // 1. Parse JSON body
    //
    let body: { owner: string; repo: string } | null = null;

    try {
        body = (await req.json()) as { owner: string; repo: string };
    } catch {
        body = null;
    }

    if (!body?.owner || !body?.repo) {
        return {
            status: 400,
            jsonBody: { error: "Missing owner or repo" }
        };
    }

    //
    // 2. Extract GitHub OAuth token from cookies
    //
    const cookieHeader = req.headers.get("Cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies["gh_token"];

    if (!token) {
        return {
            status: 401,
            jsonBody: { error: "Not authenticated" }
        };
    }

    const { owner, repo } = body;

    try {
        //
        // 3. PUT to GitHub to star repository
        //
        const starRes = await fetch(
            `https://api.github.com/user/starred/${owner}/${repo}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github+json",
                    "User-Agent": "azure-api-star"
                }
            }
        );

        if (starRes.status !== 204) {
            const text = await starRes.text();
            return {
                status: starRes.status,
                jsonBody: { error: text || "GitHub star failed" }
            };
        }

        //
        // 4. Fetch fresh repo info to get star count
        //
        const infoRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`,
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    "User-Agent": "azure-api-star"
                }
            }
        );

        const info = await infoRes.json();

        return {
            status: 200,
            jsonBody: {
                ok: true,
                count: info.stargazers_count ?? null
            }
        };

    } catch (err: any) {
        context.error("Star API error:", err);
        return {
            status: 500,
            jsonBody: { error: err.message }
        };
    }
}

app.http("githubStar", {
    route: "github/star",
    methods: ["POST"],
    authLevel: "anonymous",
    handler: githubStar
});
