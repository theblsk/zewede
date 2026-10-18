import { createClient } from "./supabase/client";

const MAX_IMAGE_DIMENSION = 1600;
const COMPRESS_THRESHOLD_BYTES = 500 * 1024;

const compressImage = async (file: File): Promise<Blob> => {
  // Small files are already web-sized; re-encoding them would only lose quality
  if (file.size <= COMPRESS_THRESHOLD_BYTES) return file;
  // GIFs may be animated and SVGs are already small; upload them untouched
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.8));
  // Safari can't encode WebP and silently returns PNG instead, so fall back to JPEG
  const webp = await toBlob('image/webp');
  const blob = webp?.type === 'image/webp' ? webp : await toBlob('image/jpeg');
  if (!blob) throw new Error('Failed to compress image');

  return blob.size < file.size ? blob : file;
};

export const uploadImage = async (file: File, bucket: string = 'menu-items') => {
  const supabase = createClient();
  const image = await compressImage(file);

  // Sanitize file name
  const fileExt = image === file ? file.name.split('.').pop() : image.type.split('/')[1];
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, image, { contentType: image.type, cacheControl: '31536000' });

  if (error) {
    throw new Error(error.message);
  }

  return data.path;
};

export const getImageUrl = (path: string | null, bucket: string = 'menu-items') => {
  if (!path) return null;
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
