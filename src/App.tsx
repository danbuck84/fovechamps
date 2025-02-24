
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/layout/MainLayout";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import RacePredictions from "@/pages/RacePredictions";
import MyPredictions from "@/pages/MyPredictions";
import Leaderboard from "@/pages/Leaderboard";
import Users from "@/pages/Users";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<PrivateRoute><MainLayout><Outlet /></MainLayout></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/race-predictions/:raceId" element={<RacePredictions />} />
            <Route path="/my-predictions" element={<MyPredictions />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
