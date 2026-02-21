import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOPICS_PATH = path.resolve(__dirname, "../blog-topics.json");
const BLOG_DIR = path.resolve(__dirname, "../../content/blog");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getExistingPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
      const { data } = matter(raw);
      return {
        title: data.title || f,
        slug: data.slug || f.replace(/\.md$/, ""),
      };
    });
}

export async function generateBlogPost() {
  const topics = JSON.parse(fs.readFileSync(TOPICS_PATH, "utf-8"));
  let next = topics.find((t) => !t.used);

  const existingPosts = getExistingPosts();
  const previousTitles = existingPosts.map((p) => p.title);

  // If all pre-set topics are used, generate a new one
  if (!next) {
    console.log("All pre-set topics used. Generating a new topic...");

    const topicResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You generate blog post topics for PassivePips, a passive forex income platform using PAMM trading. Generate ONE new unique blog topic that has NOT been covered before. Return JSON only: { "title": "...", "keywords": ["...", "..."], "targetQuery": "..." }

The targetQuery should be a real long-tail search query someone would type into Google (e.g. "is PAMM trading safe for beginners", "how to choose a forex managed account").`,
        },
        {
          role: "user",
          content: `These topics have already been written about — do NOT repeat any of them:\n${previousTitles.map((t) => `- ${t}`).join("\n")}\n\nGenerate 1 new unique topic.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const newTopic = JSON.parse(topicResponse.choices[0].message.content.trim());
    next = {
      title: newTopic.title,
      keywords: newTopic.keywords,
      targetQuery: newTopic.targetQuery || newTopic.title,
      used: false,
    };

    topics.push(next);
  }

  const today = new Date().toISOString().slice(0, 10);
  const slug = next.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Build internal links context for the AI
  const internalLinksContext = existingPosts.length > 0
    ? `\n\nExisting blog posts you MUST link to (include 1-2 relevant internal links in the body using markdown format):\n${existingPosts.map((p) => `- [${p.title}](/blog/${p.slug})`).join("\n")}`
    : "";

  const previousContext = previousTitles.length > 0
    ? `\n\nPreviously published articles (do NOT repeat the same points or topics):\n${previousTitles.map((t) => `- ${t}`).join("\n")}`
    : "";

  const targetQueryInstruction = next.targetQuery
    ? `\n- This post should directly answer the search query: "${next.targetQuery}" — structure the content to match search intent`
    : "";

  const systemPrompt = `You are an expert forex and PAMM trading content writer for PassivePips (https://www.passivepips.com). Write in a professional but approachable tone. Your goal is to educate readers about passive forex investing through PAMM accounts.

Rules:
- Write 800-1200 words
- Use clear headings (## format)
- Include practical, actionable advice
- Naturally include the keywords: ${next.keywords.join(", ")}${targetQueryInstruction}
- End with a CTA mentioning PassivePips PAMM — no direct signup links, just mention visiting passivepips.com
- Do NOT include the title as an H1 (the site handles that)
- Do NOT include frontmatter — just the markdown body
- Be SEO-friendly: use keywords in headings where natural
- Offer fresh perspectives and unique insights — avoid repeating content from previous posts${internalLinksContext}${previousContext}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Write a blog post titled: "${next.title}"` },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const body = response.choices[0].message.content.trim();
  const excerpt = body
    .split("\n")
    .find((line) => line.trim() && !line.startsWith("#"))
    ?.slice(0, 160)
    .trim() + "...";

  const frontmatter = `---
title: "${next.title}"
date: "${today}"
slug: "${slug}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
tags: ${JSON.stringify(next.keywords.slice(0, 3))}
---`;

  const fullContent = `${frontmatter}\n\n${body}\n`;
  const fileName = `${slug}.md`;

  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.writeFileSync(path.join(BLOG_DIR, fileName), fullContent, "utf-8");

  // Mark topic as used
  next.used = true;
  fs.writeFileSync(TOPICS_PATH, JSON.stringify(topics, null, 2) + "\n", "utf-8");

  console.log(`Blog post generated: ${fileName}`);

  return {
    title: next.title,
    slug,
    excerpt,
    keywords: next.keywords,
    fileName,
  };
}
