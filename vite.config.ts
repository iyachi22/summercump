import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// Helper to safely parse environment variables
function getEnvVar(env: Record<string, string>, key: string): string {
  return env[`VITE_${key}`] || '';
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '');
  
  // Log environment variables for debugging (don't log sensitive data in production)
  if (mode !== 'production') {
    console.log('Environment variables in Vite config:', {
      VITE_EMAILJS_SERVICE_ID: getEnvVar(env, 'EMAILJS_SERVICE_ID') ? '***' + getEnvVar(env, 'EMAILJS_SERVICE_ID').slice(-4) : 'Not set',
      VITE_EMAILJS_TEMPLATE_ID: getEnvVar(env, 'EMAILJS_TEMPLATE_ID') ? '***' + getEnvVar(env, 'EMAILJS_TEMPLATE_ID').slice(-4) : 'Not set',
      VITE_EMAILJS_PUBLIC_KEY: getEnvVar(env, 'EMAILJS_PUBLIC_KEY') ? '***' + getEnvVar(env, 'EMAILJS_PUBLIC_KEY').slice(-4) : 'Not set',
      VITE_SUPABASE_URL: getEnvVar(env, 'SUPABASE_URL') ? '***' + getEnvVar(env, 'SUPABASE_URL').slice(-4) : 'Not set',
      HAS_VITE_SUPABASE_ANON_KEY: !!getEnvVar(env, 'SUPABASE_ANON_KEY'),
    });
  }
  
  // Create a process.env object with VITE_ prefixed variables
  const processEnv: Record<string, string> = {
    VITE_EMAILJS_SERVICE_ID: getEnvVar(env, 'EMAILJS_SERVICE_ID'),
    VITE_EMAILJS_TEMPLATE_ID: getEnvVar(env, 'EMAILJS_TEMPLATE_ID'),
    VITE_EMAILJS_PUBLIC_KEY: getEnvVar(env, 'EMAILJS_PUBLIC_KEY'),
    VITE_SUPABASE_URL: getEnvVar(env, 'SUPABASE_URL'),
    VITE_SUPABASE_ANON_KEY: getEnvVar(env, 'SUPABASE_ANON_KEY')
  };

  return {
    plugins: [
      react(), 
      tsconfigPaths(), 
      mode === 'development' && componentTagger()
    ].filter(Boolean),
    
    // Server configuration
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      open: true,
      cors: true,
      
      // HMR configuration
      hmr: {
        overlay: false,
        protocol: 'ws',
        host: 'localhost',
        port: 3000
      },
      
      // File system access
      fs: {
        strict: false,
        allow: ['..']
      },
      
      // Watch configuration
      watch: {
        usePolling: true,
        interval: 100
      }
    },
    
    // Better error handling
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    
    // Define process.env for the client
    define: {
      'process.env': processEnv,
      // Also expose them under import.meta.env for backward compatibility
      'import.meta.env': JSON.stringify({
        ...processEnv,
        MODE: mode,
        DEV: mode !== 'production',
        PROD: mode === 'production',
      }),
    },
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
