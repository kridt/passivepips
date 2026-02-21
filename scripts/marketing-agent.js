import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateBlogPost } from "./generators/blog.js";
import { generateTweet } from "./generators/tweet.js";
import { generateInstagramContent } from "./generators/instagram.js";
import { postTweet } from "./publishers/twitter.js";
import { postToInstagram } from "./publishers/instagram.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_PATH = path.resolve(__dirname, "../content/social-log.json");

async function run() {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, blog: null, twitter: null, instagram: null, errors: [] };

  // Step 1: Generate blog post
  console.log("\n=== Step 1: Generating blog post ===");
  let blogResult;
  try {
    blogResult = await generateBlogPost();
    if (!blogResult) {
      console.log("No topics remaining. Exiting.");
      return;
    }
    logEntry.blog = { title: blogResult.title, slug: blogResult.slug, fileName: blogResult.fileName };
    console.log(`Blog: ${blogResult.title}`);
  } catch (err) {
    console.error("Blog generation failed:", err.message);
    logEntry.errors.push({ step: "blog", error: err.message });
    appendLog(logEntry);
    return; // Can't continue without the blog post
  }

  // Step 2: Generate tweet
  console.log("\n=== Step 2: Generating tweet ===");
  let tweetText;
  try {
    tweetText = await generateTweet({
      title: blogResult.title,
      slug: blogResult.slug,
      excerpt: blogResult.excerpt,
    });
    console.log(`Tweet: ${tweetText.slice(0, 100)}...`);
  } catch (err) {
    console.error("Tweet generation failed:", err.message);
    logEntry.errors.push({ step: "tweet-gen", error: err.message });
  }

  // Step 3: Generate Instagram content
  console.log("\n=== Step 3: Generating Instagram content ===");
  let igContent;
  try {
    igContent = await generateInstagramContent({
      title: blogResult.title,
      keywords: blogResult.keywords,
      slug: blogResult.slug,
    });
    console.log("Instagram content generated.");
  } catch (err) {
    console.error("Instagram generation failed:", err.message);
    logEntry.errors.push({ step: "instagram-gen", error: err.message });
  }

  // Step 4: Post to Twitter
  if (tweetText && process.env.TWITTER_API_KEY) {
    console.log("\n=== Step 4: Posting to Twitter ===");
    try {
      const tweetResult = await postTweet({
        text: tweetText,
        imagePath: igContent?.imagePath,
      });
      logEntry.twitter = { tweetId: tweetResult.tweetId };
      console.log(`Tweet posted: ${tweetResult.tweetId}`);
    } catch (err) {
      console.error("Twitter post failed:", err.message);
      logEntry.errors.push({ step: "twitter-post", error: err.message });
    }
  } else if (!process.env.TWITTER_API_KEY) {
    console.log("\n=== Step 4: Skipping Twitter (no API key) ===");
  }

  // Step 5: Post to Instagram
  if (igContent && process.env.INSTAGRAM_ACCOUNT_ID) {
    console.log("\n=== Step 5: Posting to Instagram ===");
    try {
      const igResult = await postToInstagram({
        caption: igContent.caption,
        imagePath: igContent.imagePath,
      });
      logEntry.instagram = { postId: igResult.postId, imageUrl: igResult.imageUrl };
      console.log(`Instagram posted: ${igResult.postId}`);
    } catch (err) {
      console.error("Instagram post failed:", err.message);
      logEntry.errors.push({ step: "instagram-post", error: err.message });
    }
  } else if (!process.env.INSTAGRAM_ACCOUNT_ID) {
    console.log("\n=== Step 5: Skipping Instagram (no account ID) ===");
  }

  // Step 6: Save log
  appendLog(logEntry);

  console.log("\n=== Marketing Agent Complete ===");
  if (logEntry.errors.length > 0) {
    console.log(`Completed with ${logEntry.errors.length} error(s)`);
  } else {
    console.log("All steps succeeded!");
  }
}

function appendLog(entry) {
  let log = [];
  try {
    log = JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
  } catch {
    // File doesn't exist or is empty
  }
  log.push(entry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2) + "\n", "utf-8");
  console.log("Log updated.");
}

run().catch((err) => {
  console.error("Marketing agent fatal error:", err);
  process.exit(1);
});
