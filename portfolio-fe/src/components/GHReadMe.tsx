"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import type { Code as MdastCode, InlineCode as MdastInlineCode } from "mdast";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";




import { Repo } from "@/lib/repos";

interface Props {
  repo: Repo;
  maxHeight?: number; 
}

export default function GHReadMe({ repo, maxHeight = 400 }: Props) {
  const [expanded, setExpanded] = useState(false);

  const readme = repo.readme ?? "";

  const shouldCollapse = readme.length > 2000; // long readme
  const collapsed = shouldCollapse && !expanded;

  return (
    <section className="mt-4 w-full flex flex-col">
      <h2 className="uppercase text-[11px] font-semibold tracking-wide text-gray-400 dark:text-gray-500 mb-2">
        README Preview
      </h2>

      <div
        className={[
          "prose prose-invert max-w-none",
          "bg-neutral-900/60 border border-neutral-800/50 rounded-lg",
          "p-4 text-sm leading-6 text-gray-200",
          "overflow-x-hidden",
          collapsed ? "overflow-hidden" : "overflow-y-auto",
        ].join(" ")}
        style={{
          maxHeight: collapsed ? maxHeight : "100%",
          scrollbarWidth: "none",
        }}
      >
        {readme ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
            code({ node, className, children }) {
              const mdNode = node as unknown as MdastCode | MdastInlineCode;
              const isInline = mdNode.type === "inlineCode";
              const match = /language-(\w+)/.exec(className || "");

              return !isInline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: "0.5rem 0" }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="px-1 py-0.5 rounded bg-neutral-800 text-[0.85em]">
                  {children}
                </code>
              );
            }
          }}


          >
            {readme}
          </ReactMarkdown>
        ) : (
          <p className="text-gray-400 text-sm italic">
            README not found for this repository.
          </p>
        )}
      </div>

      {shouldCollapse && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition self-start"
        >
          {expanded ? "Show Less ▲" : "Show More ▼"}
        </button>
      )}
    </section>
  );
}
