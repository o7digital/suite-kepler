import type { APIRoute } from 'astro';
import { absoluteUrl } from '../data/hotel';
import { localizedPages } from '../data/rooms';

const escapeXml = (text: string) => text.replace(/[<>&"']/g, char => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
})[char]!);

export const GET: APIRoute = () => {
  const urls = localizedPages.flatMap(paths => ['es', 'en', 'zh'].map(lang => {
    const alternates = [
      ['es', paths.es], ['en', paths.en], ['zh-Hans', paths.zh], ['x-default', paths.es],
    ].map(([language, path]) =>
      `<xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(absoluteUrl(path))}" />`,
    ).join('');
    return `<url><loc>${escapeXml(absoluteUrl(paths[lang as 'es' | 'en' | 'zh']))}</loc>${alternates}</url>`;
  })).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
