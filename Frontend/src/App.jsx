import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JobList from "./pages/JobList";
import CreateJob from "./pages/CreateJob";
import JobDetails from "./pages/JobDetails";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import Welcome from "./pages/Welcome";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Welcome / Home */}
      <Route path="/" element={<Welcome />} />

      {/* Public */}
      <Route path="/jobs" element={<JobList />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateJob />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App;
