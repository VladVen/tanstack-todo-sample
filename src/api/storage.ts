import supabase from './apiClient';

/**
 * Uploads a file to Supabase storage and returns the public URL
 * @param file The file to upload
 * @param bucket The storage bucket to upload to (default: 'todo-images')
 * @returns The public URL of the uploaded file
 */

export const uploadFile = async (
  file: File,
  bucket: string = 'todo-images',
): Promise<string> => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type, // Add content type for proper MIME type handling
      });

    if (error) {
      throw error;
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path, {
      download: false,
      transform: {
        quality: 80, // Optimize image quality
      },
    });

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
