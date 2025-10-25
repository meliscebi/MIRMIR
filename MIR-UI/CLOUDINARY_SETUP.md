# Cloudinary Setup Guide

This project uses Cloudinary for image uploads (avatars). Follow these steps to set up Cloudinary:

## 1. Create a Cloudinary Account

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Sign up for a free account (or log in if you already have one)

## 2. Get Your Cloud Name

1. After logging in, you'll see your dashboard
2. Copy your **Cloud Name** from the dashboard
3. Add it to your `.env` file:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   ```

## 3. Create an Upload Preset

1. In the Cloudinary dashboard, go to **Settings** (gear icon)
2. Navigate to the **Upload** tab
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Configure the preset:
   - **Signing Mode**: Select **Unsigned** (important for client-side uploads)
   - **Preset name**: Give it a name like `linktree_avatars`
   - **Folder**: (Optional) Set to `linktree-avatars` to organize uploads
   - **Allowed formats**: jpg, png, gif, webp
   - **Max file size**: 10 MB (or your preference)
   - **Transformation**: (Optional) Add transformations like auto image optimization
6. Click **Save**
7. Copy the **Preset name** and add it to your `.env` file:
   ```
   VITE_CLOUDINARY_UPLOAD_PRESET=linktree_avatars
   ```

## 4. Update Environment Variables

Your `.env` file should now have:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
```

## 5. Restart Development Server

After updating the `.env` file, restart your development server:

```bash
npm run dev
```

## Features

- ✅ **Drag & Drop or Click** to upload images
- ✅ **Image Preview** with avatar display
- ✅ **File Validation** (type and size)
- ✅ **Auto-organized** uploads in Cloudinary folders
- ✅ **Secure** unsigned uploads with preset restrictions

## Cloudinary Free Tier

The free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 transformations/month

More than enough for most personal projects!

## Troubleshooting

**Error: "Cloudinary is not configured"**
- Make sure both `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` are set in your `.env` file
- Restart the dev server after adding environment variables

**Upload fails with 401/403 error**
- Ensure your upload preset is set to **Unsigned** mode
- Check that the preset name is correct in your `.env` file

**Images not displaying**
- Check browser console for CORS errors
- Verify the returned URL is valid (should start with `https://res.cloudinary.com/`)
