import { useNavigate } from "react-router-dom";
import { useState } from "react"; 
import styles from "../styles/Dashboard.module.css";

function Dashboard() {
  const supplierId = localStorage.getItem("supplier_id");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");

  }

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <h2 className={styles.logo}>⚓ My App</h2>
        <nav>
          <ul>
            <li>📊 Dashboard</li>
            <li>👤 User Profile</li>
            <li>📋 Table List</li>
            <li>⚙️ Settings</li>
          </ul>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          🔒 Logout
        </button>
      </aside>

      {/* Overlay (only visible on mobile when sidebar is open) */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1>Dashboard</h1>
        </header>

        <section className={styles.content}>
          <p>Welcome to your dashboard 🎉</p>
          <p>
            Supplier ID: <strong>{supplierId}</strong>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

