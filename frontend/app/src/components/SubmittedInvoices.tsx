import styles from "../styles/Dashboard.module.css";

export default function SubmittedInvoices() {
  const invoices = [
    { id: 1, number: "INV-001", date: "2025-09-24", amount: "₱5,000", status: "Pending" },
    { id: 2, number: "INV-002", date: "2025-09-20", amount: "₱10,000", status: "Approved" },
  ];
  return (
    <>
      <div className={styles.invoiceCard}>
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice No</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.date}</td>
                <td>{inv.number}</td>
                <td>{inv.amount}</td>
                <td className={inv.status === "Approved" ? styles.statusApproved : styles.statusPending}>
                  {inv.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

