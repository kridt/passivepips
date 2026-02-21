# Instagram Graph API Setup

## Prerequisites
- Instagram account set to **Professional** (Business or Creator)
- A Facebook Page linked to the Instagram account

## Step 1: Switch to Professional Account
1. Open Instagram → Settings → Account
2. Switch to Professional Account → choose **Business**
3. Connect to your Facebook Page (create one if needed)

## Step 2: Create a Meta App
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click **My Apps** → **Create App**
3. Select **Business** type
4. Name it "PassivePips Marketing"
5. After creation, go to the App Dashboard

## Step 3: Add Instagram Permissions
1. In the App Dashboard, click **Add Product**
2. Find **Instagram** and click **Set Up**
3. Go to **App Review** → **Permissions and Features**
4. Request these permissions:
   - `instagram_basic` (read profile info)
   - `instagram_content_publish` (publish posts)
   - `pages_show_list`
   - `pages_read_engagement`

> For a Business-verified app, these are typically auto-approved.

## Step 4: Create System User (Never-Expiring Token)
1. Go to [business.facebook.com](https://business.facebook.com)
2. Navigate to **Business Settings** → **Users** → **System Users**
3. Click **Add** → name it "PassivePips Bot" → select **Admin** role
4. Click **Generate New Token**
5. Select your App ("PassivePips Marketing")
6. Check these permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
7. Click **Generate Token**
8. **Save this token** → this is your `META_ACCESS_TOKEN`

> System User tokens never expire — no refresh flow needed!

## Step 5: Get Instagram Business Account ID
1. Using your token, make this API call:
```bash
curl "https://graph.facebook.com/v21.0/me/accounts?access_token=YOUR_TOKEN"
```
2. Find your Facebook Page in the response, note its `id`
3. Then:
```bash
curl "https://graph.facebook.com/v21.0/PAGE_ID?fields=instagram_business_account&access_token=YOUR_TOKEN"
```
4. The `instagram_business_account.id` is your `INSTAGRAM_ACCOUNT_ID`

## Step 6: Add to GitHub Secrets
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:
   - `INSTAGRAM_ACCOUNT_ID` — the numeric Instagram Business Account ID
   - `META_ACCESS_TOKEN` — the System User token

## Verify
```bash
curl "https://graph.facebook.com/v21.0/YOUR_ACCOUNT_ID?fields=username,name&access_token=YOUR_TOKEN"
```
Should return your Instagram username and name.

## Notes
- Instagram API only works with **Business** or **Creator** accounts
- You can only publish to the account linked to the Facebook Page
- Image URLs must be publicly accessible (we use Cloudinary for this)
- Rate limit: 25 API calls per user per hour for content publishing
