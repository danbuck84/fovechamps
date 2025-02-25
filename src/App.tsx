
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
import RacePoints from "@/pages/RacePoints";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Users from "@/pages/Users";
import UserProfile from "@/pages/UserProfile";
import NotFound from "@/pages/NotFound";
import AllRaceResults from "@/pages/AllRaceResults";
import Tables from "@/pages/Tables";
import OfficialResults from "@/pages/OfficialResults";

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
          path="/all-race-results"
          element={
            <PrivateRoute>
              <MainLayout>
                <AllRaceResults />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/tables"
          element={
            <PrivateRoute>
              <MainLayout>
                <Tables />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/official-results"
          element={
            <PrivateRoute>
              <MainLayout>
                <OfficialResults />
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
          path="/race-points/:raceId"
          element={
            <PrivateRoute>
              <MainLayout>
                <RacePoints />
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

        <Route
          path="/users/:userId"
          element={
            <PrivateRoute>
              <MainLayout>
                <UserProfile />
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
