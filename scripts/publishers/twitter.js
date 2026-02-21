import { TwitterApi } from "twitter-api-v2";
import fs from "fs";

export async function postTweet({ text, imagePath }) {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  let mediaId;

  // Optionally attach image
  if (imagePath && fs.existsSync(imagePath)) {
    try {
      mediaId = await client.v1.uploadMedia(imagePath);
      console.log(`Twitter media uploaded: ${mediaId}`);
    } catch (err) {
      console.warn("Twitter image upload failed, posting text only:", err.message);
    }
  }

  const tweetPayload = { text };
  if (mediaId) {
    tweetPayload.media = { media_ids: [mediaId] };
  }

  const result = await client.v2.tweet(tweetPayload);
  console.log(`Tweet posted: ${result.data.id}`);

  return {
    tweetId: result.data.id,
    text,
  };
}
