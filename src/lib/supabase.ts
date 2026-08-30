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
  error?: string;
}

export interface SiteCloudData {
  profile?: any;
  projects?: any[];
  certificates?: any[];
  tools?: any[];
  skillGroups?: any[];
}

/**
 * Fetches the entire site data (profile, projects, tools, skills, certificates) from Supabase
 */
export const fetchFullSiteData = async (): Promise<SiteCloudData | null> => {
  if (!supabase || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('profile_photo_url, site_data')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.warn('Supabase: Error fetching site_data:', error.message);
      return null;
    }

    const siteData: SiteCloudData = (data?.site_data as SiteCloudData) || {};
    if (data?.profile_photo_url) {
      if (!siteData.profile) {
        siteData.profile = {};
      }
      siteData.profile.avatarUrl = data.profile_photo_url;
    }

    return siteData;
  } catch (err: any) {
    console.warn('Supabase: Error fetching full site data:', err);
    return null;
  }
};

/**
 * Persists the entire site data (profile, projects, tools, skills, certificates) to Supabase
 */
export const saveFullSiteData = async (siteData: SiteCloudData): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('portfolio_settings')
      .upsert(
        {
          id: 1,
          profile_photo_url: siteData.profile?.avatarUrl || null,
          site_data: siteData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Supabase: Error saving site_data:', error);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('Supabase: Network error saving full site data:', err);
    return false;
  }
};

/**
 * Fetches the persistent profile photo URL from Supabase 'portfolio_settings' table
 */
export const fetchProfilePhotoUrl = async (): Promise<string | null> => {
  if (!supabase || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('profile_photo_url')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.warn('Supabase: Error fetching portfolio_settings profile_photo_url:', error.message);
      return null;
    }

    if (data?.profile_photo_url && typeof data.profile_photo_url === 'string') {
      return data.profile_photo_url.trim();
    }

    return null;
  } catch (err: any) {
    console.warn('Supabase: Network or client exception while fetching profile photo:', err?.message || err);
    return null;
  }
};

/**
 * Validates, uploads an image to Supabase Storage ('portfolio-images' bucket),
 * and persists the resulting public URL into 'portfolio_settings' table.
 */
export const uploadProfilePhoto = async (file: File): Promise<UploadResult> => {
  if (!supabase || !isSupabaseConfigured()) {
    return {
      success: false,
      error:
        'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.',
    };
  }

  // 1. File Type & Extension Validation
  const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];

  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

  if (!validMimeTypes.includes(file.type) && !validExtensions.includes(fileExt)) {
    return {
      success: false,
      error: 'Invalid file format. Please upload a JPG, PNG, or WEBP image.',
    };
  }

  // 2. File Size Validation (Max 5MB)
  const MAX_SIZE_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return {
      success: false,
      error: 'Image is too large. Please select a photo under 5MB.',
    };
  }

  try {
    // 3. Generate stable storage file path
    // Using a timestamped filename inside the 'profile/' folder ensures instant cache busting
    const fileName = `profile-photo-${Date.now()}.${fileExt || 'jpg'}`;
    const filePath = `profile/${fileName}`;

    // 4. Upload to 'portfolio-images' bucket
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

    // 5. Get Public URL from Supabase Storage
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

    // 6. Persist the Public URL in 'portfolio_settings' table (id = 1)
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
        error: `Image uploaded to Storage, but failed to save in database: ${dbError.message}. Run the SQL migration in Supabase SQL editor.`,
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
