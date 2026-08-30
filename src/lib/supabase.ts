import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://uwowytatldwfbxdgruxf.supabase.co';
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  'sb_publishable_lN91wbBr3V52JOfq2JzFcg_-QA_Qv7S';

export const isSupabaseConfigured = (): boolean => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey.length > 20 &&
    !supabaseUrl.includes('your-project-id')
  );
};

// Initialize client
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  fileName?: string;
  lastUpdated?: string;
  error?: string;
}

export interface PortfolioRemoteSettings {
  profilePhotoUrl?: string | null;
  resumeUrl?: string | null;
  resumeFileName?: string | null;
  resumeLastUpdated?: string | null;
}

/**
 * Fetches all persistent settings from Supabase 'portfolio_settings' table
 */
export const fetchPortfolioSettings = async (): Promise<PortfolioRemoteSettings | null> => {
  if (!supabase || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.warn('Supabase: Error fetching portfolio_settings:', error.message);
      return null;
    }

    if (!data) return null;

    return {
      profilePhotoUrl: data.profile_photo_url ? String(data.profile_photo_url).trim() : null,
      resumeUrl: data.resume_url ? String(data.resume_url).trim() : null,
      resumeFileName: data.resume_file_name ? String(data.resume_file_name).trim() : null,
      resumeLastUpdated: data.resume_last_updated ? String(data.resume_last_updated).trim() : null,
    };
  } catch (err: any) {
    console.warn('Supabase: Exception while fetching portfolio settings:', err?.message || err);
    return null;
  }
};

/**
 * Backwards compatibility helper
 */
export const fetchProfilePhotoUrl = async (): Promise<string | null> => {
  const settings = await fetchPortfolioSettings();
  return settings?.profilePhotoUrl || null;
};

/**
 * Uploads profile photo to Supabase Storage ('portfolio-images') & saves to database
 */
export const uploadProfilePhoto = async (file: File): Promise<UploadResult> => {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      error:
        'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.',
    };
  }

  const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

  if (!validMimeTypes.includes(file.type) && !validExtensions.includes(fileExt)) {
    return {
      success: false,
      error: 'Invalid file format. Please upload a JPG, PNG, or WEBP image.',
    };
  }

  const MAX_SIZE_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return {
      success: false,
      error: 'Image is too large. Please select a photo under 5MB.',
    };
  }

  try {
    const fileName = `profile-photo-${Date.now()}.${fileExt || 'jpg'}`;
    const filePath = `profile/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/jpeg',
      });

    if (uploadError) {
      console.error('Supabase Storage Upload Error:', uploadError);
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}. Make sure bucket "portfolio-images" is Public.`,
      };
    }

    const { data: urlData } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;

    if (!publicUrl) {
      return {
        success: false,
        error: 'Failed to retrieve public URL from Supabase Storage.',
      };
    }

    const { error: dbError } = await supabase
      .from('portfolio_settings')
      .upsert(
        {
          id: 1,
          profile_photo_url: publicUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (dbError) {
      console.error('Supabase Database Error saving profile_photo_url:', dbError);
      return {
        success: false,
        error: `Image uploaded to Storage, but failed to save in database: ${dbError.message}.`,
      };
    }

    return {
      success: true,
      publicUrl,
    };
  } catch (err: any) {
    console.error('Unexpected error during profile photo upload:', err);
    return {
      success: false,
      error: err?.message || 'Network error occurred while uploading to Supabase.',
    };
  }
};

/**
 * Uploads Resume document (.pdf, .doc, .docx) to Supabase Storage ('portfolio-images') & saves to database
 */
export const uploadResumeDocument = async (file: File): Promise<UploadResult> => {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured. Please add Supabase credentials.',
    };
  }

  const validExtensions = ['pdf', 'doc', 'docx'];
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

  if (!validExtensions.includes(fileExt) && !file.type.includes('pdf')) {
    return {
      success: false,
      error: 'Invalid file format. Please select a PDF or DOC document.',
    };
  }

  const MAX_SIZE_BYTES = 15 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return {
      success: false,
      error: 'File is too large. Please select a document smaller than 15MB.',
    };
  }

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `documents/${Date.now()}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/pdf',
      });

    if (uploadError) {
      console.error('Supabase Storage Resume Upload Error:', uploadError);
      return {
        success: false,
        error: `Resume upload failed: ${uploadError.message}.`,
      };
    }

    const { data: urlData } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;

    if (!publicUrl) {
      return {
        success: false,
        error: 'Failed to retrieve public URL for resume from Supabase.',
      };
    }

    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const { error: dbError } = await supabase
      .from('portfolio_settings')
      .upsert(
        {
          id: 1,
          resume_url: publicUrl,
          resume_file_name: file.name,
          resume_last_updated: nowStr,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (dbError) {
      console.warn('Note: Could not update portfolio_settings with resume metadata:', dbError.message);
    }

    return {
      success: true,
      publicUrl,
      fileName: file.name,
      lastUpdated: nowStr,
    };
  } catch (err: any) {
    console.error('Unexpected error during resume upload:', err);
    return {
      success: false,
      error: err?.message || 'Network error occurred while uploading resume to Supabase.',
    };
  }
};
