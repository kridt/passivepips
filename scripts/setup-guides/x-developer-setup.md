# X (Twitter) Developer Account Setup

## Step 1: Create Developer Account
1. Go to [developer.x.com](https://developer.x.com)
2. Sign in with the X account you want to post from
3. Click "Sign up for Free Account" (free tier gives 500 tweets/month)
4. Fill in the required information about your use case

## Step 2: Create a Project + App
1. In the Developer Portal, go to **Projects & Apps**
2. Click **+ Add Project**
3. Name it "PassivePips Marketing"
4. Select "Making a bot" as the use case
5. Create an **App** within the project, name it "PassivePips Bot"

## Step 3: Configure App Permissions
1. Go to your App settings
2. Under **User authentication settings**, click **Set up**
3. Select **OAuth 1.0a**
4. Set App permissions to **Read and Write**
5. Set Callback URL to `https://www.passivepips.com` (not actually used for bot)
6. Set Website URL to `https://www.passivepips.com`
7. Save

## Step 4: Generate Tokens
1. Go to **Keys and tokens** tab
2. Under **Consumer Keys**, generate/regenerate:
   - **API Key** → save as `TWITTER_API_KEY`
   - **API Key Secret** → save as `TWITTER_API_SECRET`
3. Under **Authentication Tokens**, generate:
   - **Access Token** → save as `TWITTER_ACCESS_TOKEN`
   - **Access Token Secret** → save as `TWITTER_ACCESS_SECRET`

> Make sure the Access Token was generated AFTER setting Read+Write permissions.
> If you change permissions, you must regenerate the Access Token.

## Step 5: Add to GitHub Secrets
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_SECRET`

## Verify
Test locally:
```bash
TWITTER_API_KEY=xxx TWITTER_API_SECRET=xxx TWITTER_ACCESS_TOKEN=xxx TWITTER_ACCESS_SECRET=xxx node -e "
import { TwitterApi } from 'twitter-api-v2';
const c = new TwitterApi({ appKey: process.env.TWITTER_API_KEY, appSecret: process.env.TWITTER_API_SECRET, accessToken: process.env.TWITTER_ACCESS_TOKEN, accessSecret: process.env.TWITTER_ACCESS_SECRET });
c.v2.me().then(r => console.log('Authenticated as:', r.data.username));
"
```
