// Public configuration that will be available at runtime
window.appConfig = {
  // EmailJS Configuration
  VITE_EMAILJS_SERVICE_ID: 'service_2mlaf54',
  VITE_EMAILJS_TEMPLATE_ID: 'template_tm7tecw', // Replace with your actual template ID
  VITE_EMAILJS_PUBLIC_KEY: 'ZjxXaYm0dsj9It_Z6',
  
  // Supabase Configuration
  VITE_SUPABASE_URL: 'https://vlfunwonenzpfwkhlfko.supabase.co', // Your Supabase URL
  VITE_SUPABASE_ANON_KEY: 'your-supabase-anon-key' // Your Supabase Anon Key
};

// Log the loaded config (for debugging)
console.log('App config loaded:', {
  EMAILJS_SERVICE_ID: window.appConfig.VITE_EMAILJS_SERVICE_ID ? '***' + window.appConfig.VITE_EMAILJS_SERVICE_ID.slice(-4) : 'Not set',
  EMAILJS_TEMPLATE_ID: window.appConfig.VITE_EMAILJS_TEMPLATE_ID ? '***' + window.appConfig.VITE_EMAILJS_TEMPLATE_ID.slice(-4) : 'Not set',
  HAS_EMAILJS_PUBLIC_KEY: !!window.appConfig.VITE_EMAILJS_PUBLIC_KEY,
  HAS_SUPABASE_URL: !!window.appConfig.VITE_SUPABASE_URL,
  HAS_SUPABASE_KEY: !!window.appConfig.VITE_SUPABASE_ANON_KEY
});
