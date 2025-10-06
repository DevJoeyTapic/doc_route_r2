import styles from "../styles/Dashboard.module.css";

type Page = "submit" | "submitted";

interface TopbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activePage: Page;
  supplierName: string | null;
  onLogout: () => void;
}

export default function Topbar({
  toggleSidebar,
  activePage,
  supplierName,
  onLogout,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <button className={styles.menuBtn} onClick={toggleSidebar}>
        ☰
      </button>

      {/* Desktop Page Title */}
      {activePage === "submit" && <h1 className={styles.desktopTitle}>Submit Invoice</h1>}
      {activePage === "submitted" && <h1 className={styles.desktopTitle}>Submitted Invoices</h1>}

      <div className={styles.topbarRight}>
        <span className={styles.supplier}>
          Supplier Name: <strong>{supplierName}</strong>
        </span>

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

