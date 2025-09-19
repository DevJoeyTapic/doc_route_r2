import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="container">
      <h1>📊 Dashboard</h1>
      <p>Welcome! You have successfully logged in with your PIN.</p>
      <Link to="/">🔒 Logout</Link>
    </div>
  );
}

export default Dashboard;

