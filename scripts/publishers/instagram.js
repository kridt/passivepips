import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export async function postToInstagram({ caption, imagePath }) {
  // Configure Cloudinary from CLOUDINARY_URL env var (cloudinary://key:secret@cloud)
  // The cloudinary package auto-reads CLOUDINARY_URL

  // Upload image to Cloudinary for a public URL
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }

  const uploadResult = await cloudinary.uploader.upload(imagePath, {
    folder: "passivepips-instagram",
    resource_type: "image",
  });

  const imageUrl = uploadResult.secure_url;
  console.log(`Image uploaded to Cloudinary: ${imageUrl}`);

  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!accountId || !accessToken) {
    throw new Error("Missing INSTAGRAM_ACCOUNT_ID or META_ACCESS_TOKEN");
  }

  // Step 1: Create media container
  const createParams = new URLSearchParams({
    image_url: imageUrl,
    caption,
    access_token: accessToken,
  });

  const createRes = await fetch(
    `https://graph.facebook.com/v21.0/${accountId}/media`,
    { method: "POST", body: createParams }
  );
  const createData = await createRes.json();

  if (createData.error) {
    throw new Error(`Instagram container creation failed: ${createData.error.message}`);
  }

  const containerId = createData.id;
  console.log(`Instagram container created: ${containerId}`);

  // Step 2: Wait for container to be ready (poll status)
  let ready = false;
  for (let i = 0; i < 10; i++) {
    const statusRes = await fetch(
      `https://graph.facebook.com/v21.0/${containerId}?fields=status_code&access_token=${accessToken}`
    );
    const statusData = await statusRes.json();

    if (statusData.status_code === "FINISHED") {
      ready = true;
      break;
    }
    if (statusData.status_code === "ERROR") {
      throw new Error("Instagram container processing failed");
    }

    // Wait 3 seconds before next check
    await new Promise((r) => setTimeout(r, 3000));
  }

  if (!ready) {
    throw new Error("Instagram container not ready after 30 seconds");
  }

  // Step 3: Publish
  const publishParams = new URLSearchParams({
    creation_id: containerId,
    access_token: accessToken,
  });

  const publishRes = await fetch(
    `https://graph.facebook.com/v21.0/${accountId}/media_publish`,
    { method: "POST", body: publishParams }
  );
  const publishData = await publishRes.json();

  if (publishData.error) {
    throw new Error(`Instagram publish failed: ${publishData.error.message}`);
  }

  console.log(`Instagram post published: ${publishData.id}`);

  return {
    postId: publishData.id,
    imageUrl,
  };
}
