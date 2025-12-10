import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";


export async function Repos(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Processing GitHub repo request: ${request.url}`);

    const user = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    if (!user) {
        return {
            status: 500,
            body: `GITHUB_USERNAME is not defined in environment variables`
        };
    }

    // -------------------------
    // FETCH GITHUB REPOS
    // -------------------------
    try {
        const res = await fetch(
            `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`,
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
                cache: "no-store",
            }
        );

        if (!res.ok) {
            const text = await res.text();
            context.error(`GitHub API error (${res.status}): ${text}`);
            return {
                status: res.status,
                body: `GitHub API error: ${text}`
            };
        }

        const data = await res.json();

        return {
            status: 200,
            jsonBody: data
        };

    } catch (err: any) {
        context.error("Error fetching GitHub repos", err);
        return {
            status: 500,
            body: `Internal server error: ${err.message}`
        };
    }
}

app.http("githubRepos", {
    route: "github/repos",
    methods: ["GET"],
    authLevel: "anonymous",
    handler: Repos
});
