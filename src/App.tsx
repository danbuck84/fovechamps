
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import RacePredictions from "@/pages/RacePredictions";
import MyPredictions from "@/pages/MyPredictions";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/components/layout/MainLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route element={<MainLayout />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/race-predictions/:id" element={<RacePredictions />} />
                <Route path="/my-predictions" element={<MyPredictions />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
