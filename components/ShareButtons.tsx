"use client";

import { useState } from "react";

/** Share row used in the article byline and at the end of the article. */
export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const here = () => (typeof window !== "undefined" ? window.location.href : "");
  const popup = (url: string) => window.open(url, "_blank", "noopener,noreferrer,width=600,height=620");

  const shareX = () =>
    popup(`https://twitter.com/intent/tweet?url=${encodeURIComponent(here())}&text=${encodeURIComponent(title)}`);
  const shareLi = () =>
    popup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(here())}`);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(here());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <span className="by-share" aria-label="Share this article">
      <button className="s-ico" type="button" aria-label="Share on X" title="Share on X" onClick={shareX}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button className="s-ico" type="button" aria-label="Share on LinkedIn" title="Share on LinkedIn" onClick={shareLi}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button
        className={`s-ico${copied ? " copied" : ""}`}
        type="button"
        aria-label="Copy link"
        title={copied ? "Copied!" : "Copy link"}
        onClick={copy}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9.5 13.5a4 4 0 0 0 5.66 0l2.83-2.83a4 4 0 0 0-5.66-5.66l-1.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.5 10.5a4 4 0 0 0-5.66 0L6 13.34a4 4 0 0 0 5.66 5.66l1.5-1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </span>
  );
}
