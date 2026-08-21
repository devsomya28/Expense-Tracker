import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({ children }) {
  return (
    <div className="text-sm text-zinc-200 leading-relaxed space-y-3 [&_strong]:text-white [&_a]:text-brand-light [&_a]:underline [&_code]:bg-base-hover [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-white [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-white [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-white [&_blockquote]:border-l-2 [&_blockquote]:border-brand/40 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-400 [&_table]:w-full [&_table]:text-xs [&_th]:text-left [&_th]:text-zinc-500 [&_th]:border-b [&_th]:border-base-border [&_th]:pb-1.5 [&_td]:py-1.5 [&_td]:border-b [&_td]:border-base-border">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
