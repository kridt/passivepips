import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTweet({ title, slug, excerpt }) {
  const url = `https://www.passivepips.com/blog/${slug}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You write engaging tweets promoting PassivePips blog posts. Rules:
- Maximum 250 characters (leave room for the URL which will be appended)
- Be informative and engaging, not clickbaity
- Include 2-3 relevant hashtags from: #forex #PAMM #passiveincome #trading #investing #financialfreedom
- Do NOT include the URL — it will be appended automatically
- Use a professional but conversational tone`,
      },
      {
        role: "user",
        content: `Write a tweet promoting this blog post:\nTitle: ${title}\nExcerpt: ${excerpt}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 150,
  });

  let tweet = response.choices[0].message.content.trim();

  // Remove any URL the model might have included
  tweet = tweet.replace(/https?:\/\/\S+/g, "").trim();

  // Append the actual URL
  const fullTweet = `${tweet}\n\n${url}`;

  // Ensure within 280 chars
  if (fullTweet.length > 280) {
    const maxTweetLen = 280 - url.length - 2;
    tweet = tweet.slice(0, maxTweetLen - 3) + "...";
    return `${tweet}\n\n${url}`;
  }

  console.log(`Tweet generated (${fullTweet.length} chars)`);
  return fullTweet;
}
