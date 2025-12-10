import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Utility: parse cookies from the Cookie header
function parseCookies(cookieHeader: string | null): Record<string, string> {
    if (!cookieHeader) return {};
    return Object.fromEntries(
        cookieHeader.split(";").map((c) => {
            const [key, val] = c.trim().split("=");
            return [key, decodeURIComponent(val)];
        })
    );
}

export async function githubStarredList(
    req: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {

    context.log("Fetching GitHub starred list…",

        req.url
    );

    //
    // 1. Extract cookies
    //
    const cookieHeader = req.headers.get("Cookie");
    const cookies = parseCookies(cookieHeader);

    const token = cookies["gh_token"];

    if (!token) {
        return {
            status: 401,
            jsonBody: { authed: false, repos: [] }
        };
    }

    try {
        //
        // 2. Call GitHub API: GET /user/starred
        //
        const ghRes = await fetch("https://api.github.com/user/starred", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
                "User-Agent": "azure-api-starred-list"
            }
        });

        if (!ghRes.ok) {
            context.error(`GitHub starred-list error: ${ghRes.status}`);

            return {
                status: ghRes.status,
                jsonBody: { authed: false, repos: [] }
            };
        }

        const repos = await ghRes.json();

        //
        // 3. Return list
        //
        return {
            status: 200,
            jsonBody: {
                authed: true,
                repos
            }
        };

    } catch (err: any) {
        context.error("GitHub API error:", err);

        return {
            status: 500,
            jsonBody: {
                authed: false,
                repos: [],
                error: err.message ?? "Network error"
            }
        };
    }
}

app.http("githubStarredList", {
    route: "github/starred-list",
    methods: ["GET"],
    authLevel: "anonymous",
    handler: githubStarredList
});
