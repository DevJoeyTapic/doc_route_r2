import { useNavigate } from "react-router-dom";
import { useState } from "react"; 
import styles from "../styles/Dashboard.module.css";

// ✅ define allowed page types
type Page = "submit" | "submitted";

function Dashboard() {
  const supplierId = localStorage.getItem("supplier_id");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page>("submit");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleMenuClick = (page: Page) => {
    setActivePage(page);
    setSidebarOpen(false); // ✅ close sidebar on mobile
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <h2 className={styles.logo}>⚓ My App</h2>
        <nav>
          <ul>
            <li 
              className={activePage === "submit" ? styles.active : ""}
              onClick={() => handleMenuClick("submit")}
            >
              📊 Submit Invoice
            </li>
            <li
              className={activePage === "submitted" ? styles.active : ""}
              onClick={() => handleMenuClick("submitted")}
            >
              📋 Submitted Invoice
            </li>
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

          {/* Show page title only on desktop */}
          {activePage === "submit" && (
            <h1 className={styles.desktopTitle}>Submit Invoice</h1>
          )}
          {activePage === "submitted" && (
            <h1 className={styles.desktopTitle}>Submitted Invoices</h1>
          )}

          <span className={styles.supplier}>
              Supplier ID: <strong>{supplierId}</strong>
          </span>
        </header>

        <section className={styles.content}>
           {activePage === "submit" && (
            <>
              <h2 className={styles.pageTitle}>Submit Invoice</h2>
              <form className={styles.invoiceForm}>
                <div className={styles.formGroup}>
                  <label>Invoice Number</label>
                  <input type="text" placeholder="Enter invoice number" />
                </div>
                <div className={styles.formGroup}>
                  <label>Invoice Date</label>
                  <input type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label>Amount</label>
                  <input type="number" placeholder="Enter amount" />
                </div>
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <input type="text" placeholder="Enter description" />
                </div>
                <div className={styles.formGroup}>
                  <label>Attachment</label>
                  <input type="file" />
                </div>
                <div className={styles.formGroup}>
                  <label>Remarks</label>
                  <textarea placeholder="Enter remarks"></textarea>
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Submit
                </button>
              </form>
            </>
          )}
          {activePage === "submitted" && (
            <>
              <h2 className={styles.pageTitle}>Submitted Invoices</h2>
              <div className={styles.invoiceList}>
                {/* Temporary sample data */}
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>INV-001</td>
                      <td>2025-09-20</td>
                      <td>₱10,000</td>
                      <td>✅ Approved</td>
                    </tr>
                    <tr>
                      <td>INV-002</td>
                      <td>2025-09-21</td>
                      <td>₱5,500</td>
                      <td>⏳ Pending</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

