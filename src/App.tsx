
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PrivateRoute from "@/components/auth/PrivateRoute";
import AdminRoute from "@/components/auth/AdminRoute";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import MyPredictions from "@/pages/MyPredictions";
import RacePredictions from "@/pages/RacePredictions";
import RaceResults from "@/pages/RaceResults";
import RaceResultsAdmin from "@/pages/RaceResultsAdmin";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import Profile from "@/pages/Profile";
import Users from "@/pages/Users";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <Index />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-predictions"
          element={
            <PrivateRoute>
              <MainLayout>
                <MyPredictions />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/race-predictions/:raceId"
          element={
            <PrivateRoute>
              <MainLayout>
                <RacePredictions />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/race-results/:raceId"
          element={
            <PrivateRoute>
              <MainLayout>
                <RaceResults />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/race-results/:raceId"
          element={
            <PrivateRoute>
              <AdminRoute>
                <MainLayout>
                  <RaceResultsAdmin />
                </MainLayout>
              </AdminRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Leaderboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/users"
          element={
            <PrivateRoute>
              <MainLayout>
                <Users />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
