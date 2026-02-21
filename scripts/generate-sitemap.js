import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, "../content/blog");
const DIST_DIR = path.resolve(__dirname, "../dist");
const SITE_URL = "https://www.passivepips.com";

function getBlogPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      const slug = data.slug || file.replace(/\.md$/, "");
      return { slug, date: data.date || null };
    });
}

function generateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const posts = getBlogPosts();

  const staticPages = [
    { loc: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
    { loc: "/blog", changefreq: "daily", priority: "0.9", lastmod: today },
  ];

  const urls = staticPages
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .concat(
      posts.map(
        (p) => `  <url>
    <loc>${SITE_URL}/blog/${p.slug}</loc>
    <lastmod>${p.date || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
      )
    );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  if (!fs.existsSync(DIST_DIR)) {
    console.error("dist/ directory not found — run vite build first");
    process.exit(1);
  }

  fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), xml, "utf-8");
  console.log(`Sitemap generated with ${staticPages.length + posts.length} URLs`);
}

generateSitemap();
