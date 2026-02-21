import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { slug } = req.body || {};
    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ error: "Missing slug" });
    }
    const views = await redis.incr(`views:${slug}`);
    return res.status(200).json({ views });
  }

  if (req.method === "GET") {
    const { slugs } = req.query;
    if (!slugs) {
      return res.status(400).json({ error: "Missing slugs parameter" });
    }
    const slugList = slugs.split(",").filter(Boolean);
    const keys = slugList.map((s) => `views:${s}`);
    const values = await redis.mget(...keys);
    const result = {};
    slugList.forEach((s, i) => {
      result[s] = values[i] || 0;
    });
    return res.status(200).json(result);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
