
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import RacePredictions from "@/pages/RacePredictions";
import MyPredictions from "@/pages/MyPredictions";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/components/layout/MainLayout";

function App() {
  return (
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
  );
}

export default App;
