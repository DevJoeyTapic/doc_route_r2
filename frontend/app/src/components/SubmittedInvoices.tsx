import styles from "../styles/Dashboard.module.css";

export default function SubmittedInvoices() {
  return (
    <>
      <h2 className={styles.pageTitle}>Submitted Invoices</h2>
      <div className={styles.invoiceList}>
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
  );
}

