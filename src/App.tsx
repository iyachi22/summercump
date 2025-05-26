import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ConfirmRegistration from "./pages/ConfirmRegistration";
import { cleanupUnverifiedRegistrations } from './services/cleanupService';

const queryClient = new QueryClient();

// Component to handle background tasks
const BackgroundTasks = () => {
  useEffect(() => {
    // Run cleanup on app start
    cleanupUnverifiedRegistrations().catch(console.error);
    
    // Set up periodic cleanup (every 5 minutes)
    const intervalId = setInterval(() => {
      cleanupUnverifiedRegistrations().catch(console.error);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BackgroundTasks />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/confirm" element={<ConfirmRegistration />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
