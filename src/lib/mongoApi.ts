export interface MongoSiteData {
  profile?: any;
  projects?: any[];
  tools?: any[];
  skillGroups?: any[];
  certificates?: any[];
}

const STORAGE_KEYS = {
  CUSTOM_MONGO_URI: 'ar_custom_mongodb_uri',
};

export const cleanMongoUri = (rawUri: string): string => {
  if (!rawUri) return '';
  let uri = rawUri.trim().replace(/^['"]|['"]$/g, '');
  // Strip accidental < > brackets around username or password
  uri = uri.replace(/<([^>]+)>/g, '$1');
  return uri;
};

export const getCustomMongoUri = (): string => {
  if (typeof localStorage !== 'undefined') {
    return cleanMongoUri(localStorage.getItem(STORAGE_KEYS.CUSTOM_MONGO_URI) || '');
  }
  return '';
};

export const saveCustomMongoUri = (uri: string): void => {
  if (typeof localStorage !== 'undefined') {
    const cleaned = cleanMongoUri(uri);
    if (cleaned) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_MONGO_URI, cleaned);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_MONGO_URI);
    }
  }
};

export const clearCustomMongoUri = (): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_MONGO_URI);
  }
};

const getRequestHeaders = (customUri?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const uri = customUri !== undefined ? customUri.trim() : getCustomMongoUri();
  if (uri) {
    headers['x-mongodb-uri'] = uri;
  }
  return headers;
};

/**
 * Test connection to MongoDB Atlas through Vercel serverless function
 */
export const testMongoConnection = async (
  customUri?: string
): Promise<{ success: boolean; message: string; source?: string }> => {
  try {
    const headers = getRequestHeaders(customUri);
    const res = await fetch('/api/portfolio?action=test', {
      method: 'GET',
      headers,
    });

    const rawText = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      return {
        success: false,
        message: `Server returned HTTP ${res.status}: ${rawText.slice(0, 100)}`,
      };
    }

    return {
      success: !!data.success && !!data.connected,
      message: data.message || (data.connected ? 'MongoDB connected!' : 'Could not connect to MongoDB'),
      source: data.source,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to reach /api/portfolio endpoint',
    };
  }
};

/**
 * Fetches published site data from MongoDB Atlas
 */
export const fetchMongoSiteData = async (): Promise<MongoSiteData | null> => {
  try {
    const headers = getRequestHeaders();
    const res = await fetch('/api/portfolio', {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      return null;
    }

    const rawText = await res.text();
    let json: any = {};
    try {
      json = JSON.parse(rawText);
    } catch {
      return null;
    }

    if (json.success && json.data) {
      return json.data as MongoSiteData;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch MongoDB site data:', err);
    return null;
  }
};

/**
 * Saves all site data to MongoDB Atlas
 */
export const saveMongoSiteData = async (
  siteData: MongoSiteData,
  customUri?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const headers = getRequestHeaders(customUri);
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers,
      body: JSON.stringify(siteData),
    });

    const rawText = await res.text();
    let json: any = {};
    try {
      json = JSON.parse(rawText);
    } catch {
      if (res.status === 413 || rawText.includes('Request Entity Too Large') || rawText.includes('Payload Too Large')) {
        return {
          success: false,
          message: 'Images exceed the 4.5MB upload limit. Please use an image URL or smaller compressed photo.',
        };
      }
      return {
        success: false,
        message: `Server error (HTTP ${res.status}): ${rawText.slice(0, 120)}`,
      };
    }

    if (res.ok && json.success) {
      return {
        success: true,
        message: json.message || 'Portfolio published to MongoDB Atlas live!',
      };
    }

    return {
      success: false,
      message: json.error || json.message || 'Failed to save to MongoDB Atlas',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error while calling MongoDB API',
    };
  }
};
