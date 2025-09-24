import styles from "../styles/Dashboard.module.css";

type Page = "submit" | "submitted";

interface SidebarProps {
  activePage: Page;
  onMenuClick: (page: Page) => void;
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
      <h2 className={styles.logo}>⚓ My App</h2>
      <nav>
        <ul>
          <li
            className={activePage === "submit" ? styles.active : ""}
            onClick={() => onMenuClick("submit")}
          >
            📊 Submit Invoice
          </li>
          <li
            className={activePage === "submitted" ? styles.active : ""}
            onClick={() => onMenuClick("submitted")}
          >
            📋 Submitted Invoice
          </li>
        </ul>
      </nav>
      <button className={styles.logoutBtn} onClick={onLogout}>
        🔒 Logout
      </button>
    </aside>
  );
}

