import styles from "../staff_styles/Dashboard.module.css";

type StaffPage = "invoice" | "invoices";

interface TopbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activePage: StaffPage;
  // supplierName: string | null;
  onLogout: () => void;
}

export default function Topbar({
  toggleSidebar,
  activePage,
  // supplierName,
  onLogout,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <button className={styles.menuBtn} onClick={toggleSidebar}>
        ☰
      </button>

      {/* Desktop Page Title */}
      {activePage === "invoice" && <h1 className={styles.desktopTitle}>Submit Invoice</h1>}
      {activePage === "invoices" && <h1 className={styles.desktopTitle}>View Invoices</h1>}

      <div className={styles.topbarRight}>
       
        {/* Small Logout Icon for mobile */}
        <button
          className={styles.logoutIconBtn}
          onClick={onLogout}
          title="Logout"
        >
          ⎋
        </button>
      </div>
    </header>
  );
}

