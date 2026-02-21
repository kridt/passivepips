import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const IG_READY_DIR = path.resolve(__dirname, "../../content/instagram-ready");

export async function generateInstagramContent({ title, keywords, slug }) {
  // Generate caption
  const captionResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You write Instagram captions for PassivePips, a passive forex income platform using PAMM trading. Rules:
- 150-300 words
- Engaging, educational, and professional tone
- Include a CTA directing to "link in bio" (passivepips.com)
- End with 15-20 relevant hashtags on a new line
- Use line breaks for readability
- Include relevant emojis sparingly`,
      },
      {
        role: "user",
        content: `Write an Instagram caption about: "${title}"\nKeywords: ${keywords.join(", ")}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 500,
  });

  const caption = captionResponse.choices[0].message.content.trim();

  // Generate image
  const imageResponse = await openai.images.generate({
    model: "dall-e-3",
    prompt: `High-quality photograph style image for an Instagram post about: "${title}". The image should look like a real photograph or editorial shot — NOT digital art, NOT vector graphics, NOT illustrations. Think stock photography but premium. Examples: a real laptop showing trading charts in a dark moody office, a person's hands on a phone checking investments at a cafe, a cityscape at golden hour representing financial markets, coffee and newspaper on a desk. Dark moody color grading with subtle teal tones. No text, no logos, no overlays. Photorealistic only.`,
    n: 1,
    size: "1024x1024",
    quality: "standard",
  });

  const imageUrl = imageResponse.data[0].url;

  // Download the image locally
  const imgResponse = await fetch(imageUrl);
  const imgBuffer = Buffer.from(await imgResponse.arrayBuffer());

  // Save to instagram-ready folder with date-based name
  if (!fs.existsSync(IG_READY_DIR)) fs.mkdirSync(IG_READY_DIR, { recursive: true });

  const date = new Date().toISOString().slice(0, 10);
  const safeSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
  const imgPath = path.join(IG_READY_DIR, `${date}-${safeSlug}.png`);
  const captionPath = path.join(IG_READY_DIR, `${date}-${safeSlug}-caption.txt`);

  fs.writeFileSync(imgPath, imgBuffer);
  fs.writeFileSync(captionPath, caption, "utf-8");

  // Also save to content/ for Cloudinary upload (if auto-posting is enabled)
  const latestPath = path.resolve(__dirname, "../../content/latest-instagram.png");
  fs.writeFileSync(latestPath, imgBuffer);

  console.log(`Instagram content saved to: content/instagram-ready/`);
  console.log(`  Image: ${date}-${safeSlug}.png`);
  console.log(`  Caption: ${date}-${safeSlug}-caption.txt`);

  return {
    caption,
    imagePath: latestPath,
    readyDir: IG_READY_DIR,
  };
}
