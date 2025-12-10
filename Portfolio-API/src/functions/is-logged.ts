import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Helper: cookie parser
function getCookie(req: HttpRequest, name: string): string | null {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(";").map(c => c.trim());

    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value || null;
    }
    return null;
}

// Main handler
async function isLogged(
    req: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {

    context.log("Checking login status...");

    const token = getCookie(req, "gh_token");

    return {
        status: 200,
        headers: {
            "Access-Control_Allow_Credentials":"true",
            "Content-Type": "application/json",
        },
            body: JSON.stringify({ loggedIn: !!token }),
        };
}

// REGISTER FUNCTION — REQUIRED!
app.http("isLogged", {
    route: "github/is-logged",
    methods: ["GET"],
    authLevel: "anonymous",
    handler: isLogged
});
