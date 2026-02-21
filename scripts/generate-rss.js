import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, "../content/blog");
const DIST_DIR = path.resolve(__dirname, "../dist");
const SITE_URL = "https://www.passivepips.com";

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getBlogPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = data.slug || file.replace(/\.md$/, "");
      return {
        title: data.title || slug,
        slug,
        date: data.date || null,
        excerpt: data.excerpt || "",
        tags: data.tags || [],
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

function generateRss() {
  const posts = getBlogPosts();
  const buildDate = new Date().toUTCString();

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <description>${escapeXml(p.excerpt)}</description>
      <pubDate>${new Date(p.date + "T12:00:00Z").toUTCString()}</pubDate>
${p.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PassivePips Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Expert insights on PAMM trading, passive forex income, and automated investment strategies.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  if (!fs.existsSync(DIST_DIR)) {
    console.error("dist/ directory not found — run vite build first");
    process.exit(1);
  }

  fs.writeFileSync(path.join(DIST_DIR, "feed.xml"), rss, "utf-8");
  console.log(`RSS feed generated with ${posts.length} items`);
}

generateRss();
