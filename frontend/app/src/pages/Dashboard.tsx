
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SubmitInvoice from "../components/SubmitInvoice";
import SubmittedInvoices from "../components/SubmittedInvoices";
import styles from "../styles/Dashboard.module.css";

type Page = "submit" | "submitted";

export default function Dashboard() {
  const navigate = useNavigate();
  const supplierId = localStorage.getItem("supplier_id");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page>("submit");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleMenuClick = (page: Page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar
        activePage={activePage}
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
      />

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <main className={styles.main}>
        <Topbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activePage={activePage}
          supplierId={supplierId}
        />

        <section className={styles.content}>
          {activePage === "submit" && <SubmitInvoice />}
          {activePage === "submitted" && <SubmittedInvoices />}
        </section>
      </main>
    </div>
  );
}
