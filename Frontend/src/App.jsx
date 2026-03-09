import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobList from "./pages/JobList";
import CreateJob from "./pages/CreateJob";   // 👉 NEW IMPORT
import JobDetails from "./pages/JobDetails";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import Welcome from "./pages/Welcome";



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Welcome / Home */}
          <Route path="/" element={<Welcome />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateJob />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
