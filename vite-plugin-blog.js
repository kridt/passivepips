import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = "content/blog";
const MANIFEST_ID = "virtual:blog-manifest";
const POST_PREFIX = "virtual:blog-post/";
const RESOLVED_MANIFEST = "\0" + MANIFEST_ID;
const RESOLVED_POST_PREFIX = "\0" + POST_PREFIX;

export default function blogPlugin() {
  let blogRoot;

  function getManifest() {
    const dir = path.resolve(blogRoot, BLOG_DIR);
    if (!fs.existsSync(dir)) return [];

    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((file) => {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data } = matter(raw);
        const slug = data.slug || file.replace(/\.md$/, "");
        return {
          slug,
          title: data.title || slug,
          date: data.date || null,
          excerpt: data.excerpt || "",
          tags: data.tags || [],
          file,
        };
      })
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }

  function getPost(slug) {
    const dir = path.resolve(blogRoot, BLOG_DIR);
    if (!fs.existsSync(dir)) return null;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const fileSlug = data.slug || file.replace(/\.md$/, "");
      if (fileSlug === slug) {
        return {
          slug: fileSlug,
          title: data.title || fileSlug,
          date: data.date || null,
          excerpt: data.excerpt || "",
          tags: data.tags || [],
          content,
        };
      }
    }
    return null;
  }

  return {
    name: "vite-plugin-blog",

    configResolved(config) {
      blogRoot = config.root;
    },

    resolveId(id) {
      if (id === MANIFEST_ID) return RESOLVED_MANIFEST;
      if (id.startsWith(POST_PREFIX)) return "\0" + id;
      return null;
    },

    load(id) {
      if (id === RESOLVED_MANIFEST) {
        const manifest = getManifest();
        return `export default ${JSON.stringify(manifest)};`;
      }
      if (id.startsWith(RESOLVED_POST_PREFIX)) {
        const slug = id.slice(RESOLVED_POST_PREFIX.length);
        const post = getPost(slug);
        if (!post) return `export default null;`;
        return `export default ${JSON.stringify(post)};`;
      }
      return null;
    },

    configureServer(server) {
      const dir = path.resolve(blogRoot, BLOG_DIR);
      if (fs.existsSync(dir)) {
        server.watcher.add(dir);
        server.watcher.on("change", (file) => {
          if (file.includes(BLOG_DIR)) {
            const mod = server.moduleGraph.getModuleById(RESOLVED_MANIFEST);
            if (mod) server.moduleGraph.invalidateModule(mod);

            server.moduleGraph.idToModuleMap.forEach((mod, id) => {
              if (id.startsWith(RESOLVED_POST_PREFIX)) {
                server.moduleGraph.invalidateModule(mod);
              }
            });

            server.ws.send({ type: "full-reload" });
          }
        });
      }
    },
  };
}
