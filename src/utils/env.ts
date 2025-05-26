/**
 * Environment variables utility
 * Provides type-safe access to environment variables from multiple sources
 */

type EnvKey = 
  | 'VITE_EMAILJS_SERVICE_ID'
  | 'VITE_EMAILJS_TEMPLATE_ID'
  | 'VITE_EMAILJS_PUBLIC_KEY'
  | 'VITE_SUPABASE_URL'
  | 'VITE_SUPABASE_ANON_KEY';

// Default values for development
const defaultEnv: Record<EnvKey, string> = {
  VITE_EMAILJS_SERVICE_ID: 'service_2mlaf54',
  VITE_EMAILJS_TEMPLATE_ID: 'template_oho3has',
  VITE_EMAILJS_PUBLIC_KEY: 'ZjxXaYm0dsj9It_Z6',
  VITE_SUPABASE_URL: '',
  VITE_SUPABASE_ANON_KEY: ''
};

// Cache for environment variables
const envCache: Partial<Record<EnvKey, string>> = {};

// Get environment variable from all possible sources
function getEnvVar(key: EnvKey): string {
  // Return cached value if available
  if (envCache[key] !== undefined) {
    return envCache[key]!;
  }

  let value: string | undefined;
  let source = 'default';

  // 1. Try window.appConfig (from public/config.js)
  if (typeof window !== 'undefined' && (window as any).appConfig?.[key]) {
    value = (window as any).appConfig[key];
    source = 'window.appConfig';
  } 
  // 2. Try import.meta.env (Vite)
  else if ((import.meta.env as any)[key]) {
    value = (import.meta.env as any)[key];
    source = 'import.meta.env';
  } 
  // 3. Try process.env (Node/SSR)
  else if (typeof process !== 'undefined' && (process.env as any)[key]) {
    value = (process.env as any)[key];
    source = 'process.env';
  }
  // 4. Use default value
  else {
    value = defaultEnv[key];
    source = 'default';
  }

  // Cache the value
  envCache[key] = value;

  // Log the source of the value in development
  if (import.meta.env.DEV) {
    console.debug(`[Env] ${key} loaded from ${source}`);
  }

  return value;
}

// Log the environment variables being used (without sensitive values)
if (typeof window !== 'undefined') {
  const envVars = {
    EMAILJS_SERVICE_ID: getEnvVar('VITE_EMAILJS_SERVICE_ID'),
    EMAILJS_TEMPLATE_ID: getEnvVar('VITE_EMAILJS_TEMPLATE_ID'),
    EMAILJS_PUBLIC_KEY: getEnvVar('VITE_EMAILJS_PUBLIC_KEY'),
    SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL'),
    SUPABASE_ANON_KEY: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  };

  console.log('[Env] Environment variables loaded:', {
    ...envVars,
    EMAILJS_SERVICE_ID: envVars.EMAILJS_SERVICE_ID ? '***' + envVars.EMAILJS_SERVICE_ID.slice(-4) : 'Not set',
    EMAILJS_TEMPLATE_ID: envVars.EMAILJS_TEMPLATE_ID ? '***' + envVars.EMAILJS_TEMPLATE_ID.slice(-4) : 'Not set',
    EMAILJS_PUBLIC_KEY: envVars.EMAILJS_PUBLIC_KEY ? '***' + envVars.EMAILJS_PUBLIC_KEY.slice(-4) : 'Not set',
    SUPABASE_URL: envVars.SUPABASE_URL ? '***' + envVars.SUPABASE_URL.slice(-4) : 'Not set',
    HAS_SUPABASE_ANON_KEY: !!envVars.SUPABASE_ANON_KEY,
  });
}

// Export environment variables
export const env = {
  get EMAILJS_SERVICE_ID() { return getEnvVar('VITE_EMAILJS_SERVICE_ID'); },
  get EMAILJS_TEMPLATE_ID() { return getEnvVar('VITE_EMAILJS_TEMPLATE_ID'); },
  get EMAILJS_PUBLIC_KEY() { return getEnvVar('VITE_EMAILJS_PUBLIC_KEY'); },
  get SUPABASE_URL() { return getEnvVar('VITE_SUPABASE_URL'); },
  get SUPABASE_ANON_KEY() { return getEnvVar('VITE_SUPABASE_ANON_KEY'); },
} as const;
