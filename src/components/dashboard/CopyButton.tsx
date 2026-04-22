"use client";

import { useState, useTransition } from "react";

type CopyButtonProps = {
  value: string;
};

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="button button-secondary"
      onClick={() => {
        startTransition(async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
