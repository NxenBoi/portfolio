import { useState } from "react";
import Glass from "./Glass";

export default function ContactCard() {
  const [copied, setCopied] = useState(false);

  const copyDiscord = () => {
    navigator.clipboard.writeText("nxen");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Glass className="relative w-120 overflow-hidden border-white/10 flex flex-col p-6 gap-5">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-cyan-500/15 blur-3xl" />

      {/* Status badges grid - Ensure gap matches the visual rhythm */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="text-white text-xs font-semibold">Available</span>
          </div>
          <p className="text-white/40 text-[12px] leading-tight text-left">
            Currently accepting new projects
          </p>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-1.5">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-white text-xs font-semibold">Fast Replies</span>
          </div>
          <p className="text-white/40 text-[12px] leading-tight text-left">Usually within 24h</p>
        </div>
      </div>

      {/* Discord copy button — big glass pill with logo on left */}
      <Glass
        as="button"
        onClick={copyDiscord}
        className="relative w-full flex items-center justify-between gap-4 py-4 px-5 rounded-2xl hover:bg-white/10 active:scale-[0.98] cursor-pointer"
      >
        {/* Discord logo on the left */}
        <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(88,101,242,0.3)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </div>

        {/* Username & Status in the middle */}
        <div className="flex-1 flex flex-col items-start gap-0.5">
          <span className="text-white font-bold text-lg tracking-tight">nxen</span>
          <span
            className={`text-xs code transition-colors duration-300 ${copied ? "text-emerald-400" : "text-white/50"}`}
          >
            {copied ? "copied!" : "click to copy"}
          </span>
        </div>

        {/* Copy / check icon on the right */}
        {copied ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            className="shrink-0"
          >
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2.5"
            className="shrink-0"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </Glass>

      {/* OR divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Twitter / X button */}
      {/* Twitter / X button - Now strictly w-full */}
      <a
        href="https://twitter.com/nxen22"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full group flex items-center justify-center gap-3 py-3 px-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.526-8.6L2.25 2.25h6.844l4.258 5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-white font-semibold text-sm">Follow on X</span>
        </div>
        {/* Absolute or flex-end arrow to keep text centered */}
        <svg
          className="text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all duration-200"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </Glass>
  );
}
