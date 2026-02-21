# Cloudinary Setup

Cloudinary hosts the DALL-E generated images so Instagram can access them via public URL.

## Step 1: Create Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (25,000 credits/month — we use ~12)
3. Verify your email

## Step 2: Get CLOUDINARY_URL
1. Go to your Cloudinary **Dashboard**
2. Find the **API Environment variable** section
3. Copy the `CLOUDINARY_URL` value — it looks like:
   ```
   cloudinary://123456789012345:abcdefghijklmnop@your-cloud-name
   ```

## Step 3: Add to GitHub Secrets
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add repository secret:
   - `CLOUDINARY_URL` — the full cloudinary:// URL from your dashboard

## How It's Used
1. Marketing agent generates an image with DALL-E 3
2. Image is saved locally as `content/latest-instagram.png`
3. Image is uploaded to Cloudinary folder `passivepips-instagram/`
4. The public Cloudinary URL is passed to Instagram Graph API
5. Instagram downloads the image from Cloudinary to create the post

## Free Tier Limits
- 25,000 transformations/month
- 25 GB storage
- 25 GB bandwidth
- We use ~12 images/month — well within limits

## Notes
- The `cloudinary` npm package auto-reads the `CLOUDINARY_URL` environment variable
- No additional configuration needed in the code
- Images are stored permanently in Cloudinary (useful for reuse)
