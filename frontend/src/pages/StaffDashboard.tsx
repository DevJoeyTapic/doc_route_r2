import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StaffSubmitInvoice from "../components/StaffSubmitInvoice";
// import ViewSubmittedInvoices from "../components/ViewSubmittedInvoices";
import styles from "../styles/Dashboard.module.css";

type Page = "suppliers" | "invoices";

export default function StaffDashboard() {
  const navigate = useNavigate();

  const staffName = localStorage.getItem("staff_name");
  const accessToken = localStorage.getItem("access_token");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page>("suppliers");

  // ------------------------------
  //   Logout Handler
  // ------------------------------
  const handleLogout = () => {
    toast.info("You have been logged out.", { autoClose: 2000 });

    setTimeout(() => {
      localStorage.clear();
      navigate("/staff/login");
    }, 2000);
  };

  // ------------------------------
  //   JWT Decode Helper
  // ------------------------------
  const getTokenExpiration = (token: string): number | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));
      return decoded.exp ? decoded.exp * 1000 : null;
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      return null;
    }
  };

  // ---------------------------------
  // Redirect if not authenticated
  // ---------------------------------
  useEffect(() => {
    if (!accessToken) navigate("/staff-login");
  }, [accessToken, navigate]);

  // ---------------------------------
  // Auto logout timer based on JWT
  // ---------------------------------
  useEffect(() => {
    if (!accessToken) return;

    const expTime = getTokenExpiration(accessToken);
    if (!expTime) return;

    const timeLeft = expTime - Date.now();
    if (timeLeft <= 0) {
      handleLogout();
      return;
    }

    const warnTimer = setTimeout(() => {
      toast.warning("Your session will expire in 1 minute.", { autoClose: 60000 });
    }, Math.max(timeLeft - 60000, 0));

    const logoutTimer = setTimeout(() => {
      handleLogout();
    }, timeLeft);

    return () => {
      clearTimeout(warnTimer);
      clearTimeout(logoutTimer);
    };
  }, [accessToken]);

  // ------------------------------
  //   Render Component
  // ------------------------------
  return (
    <div className={styles.dashboard}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <Sidebar
        activePage={activePage}
        onMenuClick={(page: Page) => {
          setActivePage(page);
          setSidebarOpen(false);
        }}
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
          staffName={staffName}
          onLogout={handleLogout}
        />

        <section className={styles.content}>
          {activePage === "suppliers" && <StaffSubmitInvoice accessToken={accessToken} />}
          {/* {activePage === "invoices" && <ViewSubmittedInvoices accessToken={accessToken} />} */}
        </section>
      </main>
    </div>
  );
}

