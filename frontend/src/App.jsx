import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ClassView from "./pages/ClassView";
import ClassListing from "./pages/ClassListing";
import NotesListing from "./pages/NotesListing";
import StudentListing from "./pages/StudentListing";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role === "faculty" ? <FacultyDashboard /> : <StudentDashboard />}
          </ProtectedRoute>
        }
      />

      <Route path="/faculty" element={<ProtectedRoute><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/classes" element={<ProtectedRoute><ClassListing /></ProtectedRoute>} />
      <Route path="/classes/:id" element={<ProtectedRoute><ClassView /></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><NotesListing /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><StudentListing /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
