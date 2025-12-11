import ContextProviderTree from "@/context/ContextProviderTree";
import RepoList from "@/components/RepoList";
import { fetchRepos } from "@/lib/github";
import { Repo } from "@/lib/repos";
import { userAgent } from "next/server";
import { headers } from "next/headers";

// --------------------
// SEO Metadata
// --------------------
export const metadata = {
  title: "Jonathan Gracias – Portfolio",
  description:
    "A showcase of projects spanning backend automation, web development, creative technology, and interactive demos.",
  openGraph: {
    title: "Jonathan Gracias – Portfolio",
    description:
      "A showcase of projects spanning backend automation, web development, creative technology, and interactive demos.",
    url: "https://your-domain.com/",
    siteName: "Jonathan Gracias Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Gracias – Portfolio",
    description:
      "A showcase of projects spanning backend automation, web development, creative technology, and interactive demos.",
  },
};


export default async function Page() {
/*   let repos: Repo[] = [];
  repos = await fetchRepos(); */

  const raw = headers();                // ReadonlyHeaders (Next.js)
  const h = new Headers(await raw);           // Convert to Headers (Web API)
  const ua = userAgent({ headers: h }); // Now valid
  const isMobile = ua.device.type === "mobile" || ua.device.type === "tablet";

  return (
    // <ContextProviderTree repos={repos} isMobile={isMobile}>
      <main className="relative flex flex-col min-h-screen overflow-hidden">
        {/* Header / Intro */}
        <section
          aria-labelledby="portfolio-heading"
          className="
            flex flex-col w-full max-w-[1000px] mx-auto
            p-4 py-8 sm:py-10
            gap-4 md:gap-2
            items-center text-center
          "
        >
          <h1
            id="portfolio-heading"
            className="
              md:text-4xl text-2xl font-extrabold
              text-blue-400 dark:text-blue-300
              drop-shadow-sm mb-3
            "
          >
            Jonathan Gracias – Portfolio
          </h1>

          <p className="max-w-2xl text-gray-700 dark:text-gray-300 md:text-left">
            A collection of my projects spanning backend automation, web development,
            and creative technology. Built with Next.js and deployed on Azure.
          </p>
        </section>


        {/* Repo Grid */}
        {/* <section
          aria-label="Repository List"
          className="
            flex flex-col items-center justify-center w-full h-fit mx-auto
            overflow-hidden
            mb-5
          "
        >
          {/* Accessibility + SEO secondary heading 
          <h2 className="sr-only">Projects</h2>

          <RepoList />
        </section>
 */}

        {/* Footer */}
        <footer className="w-full h-full min-h- text-center text-sm text-gray-500 mt-5">
          © {new Date().getFullYear()} Jonathan Gracias — Built with Next.js + Tailwind + Azure
        </footer>

      </main>
   // </ContextProviderTree>
  );
}
