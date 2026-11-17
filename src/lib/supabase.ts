import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

const STORAGE_KEYS = {
  CUSTOM_URL: 'ar_custom_supabase_url',
  CUSTOM_KEY: 'ar_custom_supabase_key',
};

// Known dead placeholder project ID
const DEAD_PLACEHOLDER_SUBSTRING = 'uwowytatldwfbxdgruxf';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isCustom: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const customUrl = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CUSTOM_URL) : null;
  const customKey = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CUSTOM_KEY) : null;

  if (customUrl && customKey && customUrl.trim() && customKey.trim()) {
    return {
      url: customUrl.trim(),
      anonKey: customKey.trim(),
      isCustom: true,
    };
  }

  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

  // If the env contains the dead placeholder, ignore it
  if (envUrl.includes(DEAD_PLACEHOLDER_SUBSTRING)) {
    return { url: '', anonKey: '', isCustom: false };
  }

  return {
    url: envUrl,
    anonKey: envKey,
    isCustom: false,
  };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return (
    !!url &&
    !!anonKey &&
    url.startsWith('https://') &&
    anonKey.length > 20 &&
    !url.includes('your-project-id') &&
    !url.includes(DEAD_PLACEHOLDER_SUBSTRING)
  );
};

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const { url, anonKey } = getSupabaseConfig();
  if (cachedClient && cachedUrl === url && cachedKey === anonKey) {
    return cachedClient;
  }
  try {
    cachedClient = createClient(url, anonKey);
    cachedUrl = url;
    cachedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const saveCustomSupabaseConfig = (url: string, anonKey: string): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.CUSTOM_KEY, anonKey.trim());
  }
  cachedClient = null;
  cachedUrl = '';
  cachedKey = '';
};

export const clearCustomSupabaseConfig = (): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_URL);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_KEY);
  }
  cachedClient = null;
  cachedUrl = '';
  cachedKey = '';
};

export const testSupabaseConnection = async (
  testUrl?: string,
  testKey?: string
): Promise<{ success: boolean; message: string }> => {
  const cfg = getSupabaseConfig();
  const url = testUrl !== undefined ? testUrl.trim() : cfg.url;
  const key = testKey !== undefined ? testKey.trim() : cfg.anonKey;

  if (!url || !key) {
    return {
      success: false,
      message: 'Supabase URL and Anon Key are required.',
    };
  }

  if (!url.startsWith('https://')) {
    return {
      success: false,
      message: 'Supabase URL must start with https://',
    };
  }

  if (url.includes(DEAD_PLACEHOLDER_SUBSTRING)) {
    return {
      success: false,
      message: 'The URL provided is a non-existent placeholder. Please use your real Supabase project URL.',
    };
  }

  try {
    const client = createClient(url, key);
    const { error } = await client
      .from('portfolio_settings')
      .select('id, updated_at')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      if (error.message.includes('relation "public.portfolio_settings" does not exist') || error.code === '42P01') {
        return {
          success: false,
          message:
            'Connected to Supabase, but table "portfolio_settings" is missing. Please run the SQL migration script (supabase/migrations/01_portfolio_settings.sql) in your Supabase SQL Editor.',
        };
      }
      return {
        success: false,
        message: `Supabase returned: ${error.message}`,
      };
    }

    return {
      success: true,
      message: 'Supabase connection verified! Cloud sync is operational and ready to update your live website.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection error: ${err?.message || 'Could not connect to host.'}`,
    };
  }
};

export const supabase: SupabaseClient | null = getSupabaseClient();

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
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await client
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
export const saveFullSiteData = async (
  siteData: SiteCloudData
): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return { success: false, error: 'Supabase cloud database is not configured' };
  }

  try {
    // Strip adminPasscode from profile to keep it secure
    const safeData: SiteCloudData = {
      ...siteData,
      profile: siteData.profile ? { ...siteData.profile } : undefined,
    };
    if (safeData.profile && safeData.profile.adminPasscode) {
      delete safeData.profile.adminPasscode;
    }

    const { error } = await client.from('portfolio_settings').upsert(
      {
        id: 1,
        profile_photo_url: safeData.profile?.avatarUrl || null,
        site_data: safeData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Supabase: Error saving site_data:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Supabase: Network error saving full site data:', err);
    return { success: false, error: err?.message || 'Network error occurred' };
  }
};

/**
 * Contact Message Database Helpers for Supabase
 */
export const insertContactMessage = async (msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return false;
  try {
    const { error } = await client.from('contact_messages').insert({
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      read: false,
    });
    if (error) {
      console.warn('Supabase: Error inserting contact message:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase: Network error saving contact message:', err);
    return false;
  }
};

export const fetchContactMessages = async (): Promise<any[]> => {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return [];
  try {
    const { data, error } = await client
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase: Error fetching contact messages:', error.message);
      return [];
    }
    return (
      data?.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        read: !!m.read,
        timestamp: new Date(m.created_at).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      })) || []
    );
  } catch (err) {
    console.error('Supabase: Network error fetching contact messages:', err);
    return [];
  }
};

export const deleteContactMessageFromDb = async (id: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return false;
  try {
    const { error } = await client.from('contact_messages').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
};

export const markContactMessageReadInDb = async (id: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return false;
  try {
    const { error } = await client.from('contact_messages').update({ read: true }).eq('id', id);
    return !error;
  } catch {
    return false;
  }
};

export const clearContactMessagesInDb = async (): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) return false;
  try {
    const { error } = await client
      .from('contact_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    return !error;
  } catch {
    return false;
  }
};

/**
 * Fetches the persistent profile photo URL from Supabase 'portfolio_settings' table
 */
export const fetchProfilePhotoUrl = async (): Promise<string | null> => {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await client
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
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return {
      success: false,
      error:
        'Supabase is not configured. Please add your Supabase URL and Anon Key in Admin Settings -> Cloud Database.',
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

    const { error: uploadError } = await client.storage
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

    const { data: urlData } = client.storage.from('portfolio-images').getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl;

    if (!publicUrl) {
      return {
        success: false,
        error: 'Failed to retrieve public URL from Supabase Storage.',
      };
    }

    const { error: dbError } = await client.from('portfolio_settings').upsert(
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
