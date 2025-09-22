import { Link } from "react-router-dom";

function Dashboard() {
  const supplierId = localStorage.getItem("supplier_id");
  return (
    <div className="container">
      <h1>📊 Dashboard</h1>
      <p>Welcome! You have successfully logged in with your PIN.</p>
      <p>Supplier ID: {supplierId}</p>
      <Link to="/">🔒 Logout</Link>
    </div>
  );
}

export default Dashboard;

