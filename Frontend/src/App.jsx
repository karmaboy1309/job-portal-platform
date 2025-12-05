import { BrowserRouter, Routes, Route } from "react-router-dom";
import JobList from "./pages/JobList";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
