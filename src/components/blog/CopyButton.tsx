'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <Check size={12} className="text-emerald-400" />
          <span className="text-[11px] text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          <span className="text-[11px]">Copy</span>
        </>
      )}
    </button>
  );
};
