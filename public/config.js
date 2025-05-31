// Public configuration that will be available at runtime
window.appConfig = {
  // EmailJS Configuration
  VITE_EMAILJS_SERVICE_ID: 'service_2mlaf54',
  VITE_EMAILJS_TEMPLATE_ID: 'template_tm7tecw', // Replace with your actual template ID
  VITE_EMAILJS_PUBLIC_KEY: 'ZjxXaYm0dsj9It_Z6',
  
  // Supabase Configuration
  VITE_SUPABASE_URL: 'https://vlfunwonenzpfwkhlfko.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZnVud29uZW56cGZ3a2hsZmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwOTUyNDgsImV4cCI6MjAzMjY3MTI0OH0.9KJ5X6Q8Q2qZ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9'
};

// Log the loaded config (for debugging)
console.log('App config loaded:', {
  EMAILJS_SERVICE_ID: window.appConfig.VITE_EMAILJS_SERVICE_ID ? '***' + window.appConfig.VITE_EMAILJS_SERVICE_ID.slice(-4) : 'Not set',
  EMAILJS_TEMPLATE_ID: window.appConfig.VITE_EMAILJS_TEMPLATE_ID ? '***' + window.appConfig.VITE_EMAILJS_TEMPLATE_ID.slice(-4) : 'Not set',
  HAS_EMAILJS_PUBLIC_KEY: !!window.appConfig.VITE_EMAILJS_PUBLIC_KEY,
  HAS_SUPABASE_URL: !!window.appConfig.VITE_SUPABASE_URL,
  HAS_SUPABASE_KEY: !!window.appConfig.VITE_SUPABASE_ANON_KEY
});
