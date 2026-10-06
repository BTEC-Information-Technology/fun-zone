import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { privacyContent } from './privacyContent';

/**
 * Privacy Policy page, shared content (a single place to maintain). Rendered as
 * a page in every app, linked from the footer/menu.
 * Requires the @tailwindcss/typography plugin in the app that uses it (for `prose`).
 */
export function PrivacyPolicy({ lang }: { lang: string }) {
  return (
    <article className="prose prose-invert prose-sm mx-auto max-w-2xl p-6 prose-headings:font-semibold prose-a:text-sky-400">
      <Markdown remarkPlugins={[remarkGfm]}>{privacyContent(lang)}</Markdown>
    </article>
  );
}
