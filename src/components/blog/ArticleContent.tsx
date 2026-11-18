import React from 'react';
import Markdoc from '@markdoc/markdoc';
import { CopyButton } from './CopyButton';

interface ArticleContentProps {
  contentNode: any;
}

const CodeBlock: React.FC<{ language?: string; children: React.ReactNode }> = ({
  language,
  children,
}) => {
  const textToCopy = typeof children === 'string' ? children : String(children || '');

  return (
    <div className="relative my-6 rounded-xl border border-white/10 bg-[#07080d] overflow-hidden group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02] text-xs font-mono text-gray-400">
        <span className="uppercase text-[11px] text-emerald-400 font-semibold tracking-wider">
          {language || 'code'}
        </span>
        <CopyButton text={textToCopy} />
      </div>

      {/* Code Body */}
      <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm text-gray-200 leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
};

const components = {
  CodeBlock,
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="px-1.5 py-0.5 rounded bg-white/[0.08] text-emerald-300 font-mono text-[0.88em]">
      {children}
    </code>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="my-6 pl-4 border-l-2 border-emerald-500/60 bg-emerald-500/[0.02] py-2 text-gray-300 italic text-sm sm:text-base">
      {children}
    </blockquote>
  ),
};

export const ArticleContent: React.FC<ArticleContentProps> = ({ contentNode }) => {
  if (!contentNode) return null;

  const transformed = Markdoc.transform(contentNode, {
    nodes: {
      fence: {
        render: 'CodeBlock',
        attributes: {
          language: { type: String },
        },
      },
    },
  });

  return (
    <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-hr:border-white/10">
      {Markdoc.renderers.react(transformed, React, { components })}
    </div>
  );
};
