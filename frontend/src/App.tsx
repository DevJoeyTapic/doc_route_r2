import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PinPage from "./pages/PinPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PinPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
