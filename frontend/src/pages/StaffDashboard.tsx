import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StaffSidebar from "../staff_components/StaffSidebar";
import StaffTopbar from "../staff_components/StaffTopbar";
import StaffSubmitInvoice from "../staff_components/StaffSubmitInvoice";
import ViewSubmittedInvoices from "../staff_components/ViewSubmittedInvoices";
import styles from "../staff_styles/Dashboard.module.css";

type StaffPage = "invoice" | "invoices";

export default function StaffDashboard() {
  const navigate = useNavigate();

  // const staffName = localStorage.getItem("staff_name");
  const accessToken = localStorage.getItem("access_token");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<StaffPage>("invoice");

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
  //      Menu Click Handler      -   
  // ------------------------------
  const handleMenuClick = (page: StaffPage) => {
    setActivePage(page);
    setSidebarOpen(false);
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
    if (!accessToken) navigate("/staff/login");
  }, [accessToken, navigate]);

  // --------------------------------------
//   Auto logout timer based on JWT exp -
// --------------------------------------
useEffect(() => {
    if (!accessToken) return;

    const expTime = getTokenExpiration(accessToken);
    if (!expTime) {
      console.warn("⚠️ No exp field in JWT or failed to decode.");
      return;
    };
      
    const currentTime = Date.now();
    const timeLeft = expTime - currentTime;

    console.group("🔐 JWT Session Debug");
    console.log("Time Left (minutes):", Math.floor(timeLeft / 60000));
    console.groupEnd();

    if (timeLeft <= 0) {
      console.warn("⚠️ Token already expired. Logging out.");
      handleLogout();
      return;
    }

    // Warn 1 minute before logout
    const warnTimer = setTimeout(() => {
      toast.warning("Your session will expire in 1 minute.", { autoClose: 60000 });
      console.info("⚠️ 1-minute warning toast shown.");
    }, Math.max(timeLeft - 60000, 0));

    // Auto logout at expiration
    const logoutTimer = setTimeout(() => {
      console.warn("⏰ Token expired. Logging out automatically.");
      handleLogout();
    }, timeLeft);

    // ------------------------------------------
    //  Cleanup timers to prevent memory leaks  -
    // ------------------------------------------
    return () => {
      clearTimeout(warnTimer);
      clearTimeout(logoutTimer);
    };
  }, [accessToken, navigate]);

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

      <StaffSidebar
        activePage={activePage}
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
      />

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <main className={styles.main}>
        <StaffTopbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activePage={activePage}
          // staffName={staffName}
          onLogout={handleLogout}
        />

        <section className={styles.content}>
          {activePage === "invoice" && <StaffSubmitInvoice accessToken={accessToken} />}
          {activePage === "invoices" && <ViewSubmittedInvoices accessToken={accessToken} />}
        </section>
      </main>
    </div>
  );
}

