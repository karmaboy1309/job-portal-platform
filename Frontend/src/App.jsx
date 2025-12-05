import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobList from "./pages/JobList";
import CreateJob from "./pages/CreateJob";   // 👉 NEW IMPORT
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Job List */}
        <Route path="/" element={<JobList />} />

        {/* Create Job Page */}
        <Route path="/create" element={<CreateJob />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
