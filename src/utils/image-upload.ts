import { createClient } from "./supabase/client";

export const uploadImage = async (file: File, bucket: string = 'menu-items') => {
  const supabase = createClient();
  
  // Sanitize file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

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

