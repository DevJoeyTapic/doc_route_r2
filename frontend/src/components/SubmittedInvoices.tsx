import { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";

interface Invoice {
  invoice_id: string;
  invoice_number: string;
  submitted_date: string;
  amount_due: string;
  description: string;
  pdf_file: string;
  date_created: string;
}

interface SubmittedInvoicesProps {
  supplierId: string | null;
  accessToken: string | null;
}


export default function SubmittedInvoices({ accessToken }: SubmittedInvoicesProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    fetch("http://localhost:8000/invoices/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch invoices");
        return res.json();
      })
      .then((data) => {
        setInvoices(data);
      })
      .catch((err) => {
        console.error("Error fetching invoices:", err);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <p>Loading invoices...</p>;

  return (
    <div className={styles.invoiceCard}>
      <table className={styles.invoiceTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Invoice No</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((inv) => (
              <tr key={inv.invoice_id}>
                <td>{new Date(inv.submitted_date).toLocaleDateString()}</td>
                <td>{inv.invoice_number}</td>
                <td>₱{parseFloat(inv.amount_due).toLocaleString()}</td>
                <td>{inv.description || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No invoices found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

