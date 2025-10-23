import styles from "../staff_styles/Dashboard.module.css";

type StaffPage = "invoice" | "invoices";

interface SidebarProps {
  activePage: StaffPage;
  onMenuClick: (page: StaffPage) => void;
  onLogout: () => void;
  sidebarOpen: boolean;
}

export default function Sidebar({
  activePage,
  onMenuClick,
  onLogout,
  sidebarOpen,
}: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
      <h3 className={styles.logo}>⚓ Dashboard</h3>
      <nav>
        <ul>
          <li
            className={activePage === "invoice" ? styles.active : ""}
            onClick={() => onMenuClick("invoice")}
          >
            📊 Submit Invoice
          </li>
          <li
            className={activePage === "invoices" ? styles.active : ""}
            onClick={() => onMenuClick("invoices")}
          >
            📋 View Invoice
          </li>
        </ul>
      </nav>
      <button className={styles.logoutBtn} onClick={onLogout}>
        🔒 Logout
      </button>
    </aside>
  );
}

