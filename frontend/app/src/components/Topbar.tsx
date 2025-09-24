import styles from "../styles/Dashboard.module.css";

type Page = "submit" | "submitted";

interface TopbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activePage: Page;
  supplierId: string | null;
}

export default function Topbar({
  toggleSidebar,
  activePage,
  supplierId,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <button className={styles.menuBtn} onClick={toggleSidebar}>
        ☰
      </button>

      {/* Desktop Page Title */}
      {activePage === "submit" && <h1 className={styles.desktopTitle}>Submit Invoice</h1>}
      {activePage === "submitted" && <h1 className={styles.desktopTitle}>Submitted Invoices</h1>}

      <span className={styles.supplier}>
        Supplier ID: <strong>{supplierId}</strong>
      </span>
    </header>
  );
}

