// Public configuration that will be available at runtime
window.appConfig = {
  VITE_EMAILJS_SERVICE_ID: 'service_2mlaf54',
  VITE_EMAILJS_TEMPLATE_ID: 'template_oho3has',
  VITE_EMAILJS_PUBLIC_KEY: 'ZjxXaYm0dsj9It_Z6',
  VITE_SUPABASE_URL: '', // Add your Supabase URL here
  VITE_SUPABASE_ANON_KEY: '' // Add your Supabase Anon Key here
};

// Log the loaded config (for debugging)
console.log('App config loaded:', {
  EMAILJS_SERVICE_ID: window.appConfig.VITE_EMAILJS_SERVICE_ID ? '***' + window.appConfig.VITE_EMAILJS_SERVICE_ID.slice(-4) : 'Not set',
  EMAILJS_TEMPLATE_ID: window.appConfig.VITE_EMAILJS_TEMPLATE_ID ? '***' + window.appConfig.VITE_EMAILJS_TEMPLATE_ID.slice(-4) : 'Not set',
  HAS_EMAILJS_PUBLIC_KEY: !!window.appConfig.VITE_EMAILJS_PUBLIC_KEY,
  HAS_SUPABASE_URL: !!window.appConfig.VITE_SUPABASE_URL,
  HAS_SUPABASE_KEY: !!window.appConfig.VITE_SUPABASE_ANON_KEY
});
