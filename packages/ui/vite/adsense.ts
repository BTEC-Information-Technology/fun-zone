import { resolve } from 'node:path';
import { loadEnv, type Plugin } from 'vite';

const CLIENT_RE = /^ca-pub-\d+$/;

/**
 * Injects the Google AdSense tags into `index.html` and exposes the publisher ID
 * to app code as `import.meta.env.VITE_ADSENSE_CLIENT`.
 *
 * The ID is never committed. It is read from the `VITE_ADSENSE_CLIENT` variable,
 * either from the process environment (Cloudflare build variables) or from a
 * `.env` / `.env.local` file at the monorepo root. Without a valid ID nothing is
 * injected and `AdBanner` renders its development placeholder.
 */
export function adsense(): Plugin {
  let client = '';
  return {
    name: 'funzone-adsense',
    config(config, { mode }) {
      const root = config.root ?? process.cwd();
      const env = {
        ...loadEnv(mode, root, 'VITE_'),
        ...loadEnv(mode, resolve(root, '../..'), 'VITE_'),
      };
      const value = (process.env.VITE_ADSENSE_CLIENT ?? env.VITE_ADSENSE_CLIENT ?? '').trim();
      client = CLIENT_RE.test(value) ? value : '';
      return { define: { 'import.meta.env.VITE_ADSENSE_CLIENT': JSON.stringify(client) } };
    },
    transformIndexHtml() {
      if (!client) return [];
      return [
        { tag: 'meta', attrs: { name: 'google-adsense-account', content: client }, injectTo: 'head' },
        {
          tag: 'script',
          attrs: {
            async: true,
            src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`,
            crossorigin: 'anonymous',
          },
          injectTo: 'head',
        },
      ];
    },
  };
}
