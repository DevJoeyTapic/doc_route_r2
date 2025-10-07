
import { useNavigate } from "react-router-dom";
import { useState,useEffect} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import SubmitInvoice from "../components/SubmitInvoice";
import SubmittedInvoices from "../components/SubmittedInvoices";
import styles from "../styles/Dashboard.module.css";

type Page = "submit" | "submitted";

export default function Dashboard() {
  const navigate = useNavigate();

  const supplierId = localStorage.getItem("supplier_id");
  const supplierName = localStorage.getItem("supplier_name");
  const accessToken = localStorage.getItem("access_token"); // JWT

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page>("submit");
  
  
  const handleLogout = () => {
    localStorage.clear();
    toast.dismiss();
    navigate("/");
    toast.info("Session expired. You have been logged out.", { autoClose: 3000 });
  };

  const handleMenuClick = (page: Page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

 // Decode JWT to get expiration time
  const getTokenExpiration = (token: string): number | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));
      return decoded.exp ? decoded.exp * 1000 : null; // convert to ms
    } catch {
      return null;
    }
  };

  // Auto logout timer based on JWT exp
  useEffect(() => {
    if (!accessToken) return;

    const expTime = getTokenExpiration(accessToken);
    if (!expTime) return;

    const currentTime = Date.now();
    const timeLeft = expTime - currentTime;

    if (timeLeft <= 0) {
      handleLogout();
      return;
    }

    // Warn 1 minute before logout
    const warnTimer = setTimeout(() => {
      toast.warning("Your session will expire in 1 minute.", { autoClose: 60000 });
    }, Math.max(timeLeft - 60000, 0));

    // Auto logout at expiration
    const logoutTimer = setTimeout(() => {
      handleLogout();
    }, timeLeft);

    return () => {
      clearTimeout(warnTimer);
      clearTimeout(logoutTimer);
    };
  }, [accessToken]);

  return (
    <div className={styles.dashboard}>
      {/* Toast Notification Container */}
      <ToastContainer />

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
          supplierName={supplierName}
          onLogout={handleLogout} 
        />

        <section className={styles.content}>
          {activePage === "submit" && (<SubmitInvoice supplierId={supplierId} accessToken={accessToken} /> )}
          {activePage === "submitted" && <SubmittedInvoices />}
        </section>
      </main>
    </div>
  );
}
