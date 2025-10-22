import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "../styles/Dashboard.module.css";

interface Props {
  accessToken: string | null;
}

export default function StaffSubmitInvoice({ 
  accessToken 
}: Props
) {
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [supplierName, setSupplierName] = useState("");
  const [vesselName, setVesselName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  
  const [amount, setAmount] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // Fetch supplier suggestions
  // ---------------------------
  useEffect(() => {
    const fetchSuppliers = async () => {
      if (supplierName.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8000/api/suppliers/?search=${supplierName}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          // assume API returns list of supplier objects with supplier_name
          setSuggestions(data.map((s: any) => s.supplier_name));
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
      }
    };

    const timeout = setTimeout(fetchSuppliers, 300); // debounce 300ms
    return () => clearTimeout(timeout);
  }, [supplierName, accessToken]);

  // ---------------------------
  // Submit form
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplierName || !invoiceNumber || !amount || !vesselName) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!accessToken) {
      toast.error("No access token found. Please log in again.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("supplier_name", supplierName);
    formData.append("vessel_name", vesselName);
    formData.append("invoice_number", invoiceNumber);
    formData.append("invoice_date", invoiceDate);
    formData.append("amount", amount);
    if (attachment) formData.append("attachment", attachment);

    try {
      const res = await fetch("http://localhost:8000/invoices/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      toast.success("Invoice submitted successfully!");
      setSupplierName("");
      setVesselName("");
      setInvoiceNumber("");
      setAmount("");
      setAttachment(null);
      setInvoiceDate(new Date().toISOString().split("T")[0]);
      setSuggestions([]);

    } catch (err: any) {
      toast.error(err.message || "Failed to submit invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Submit Invoice (Staff)</h2>

      <form className={styles.invoiceForm} onSubmit={handleSubmit} noValidate>
        {/* Supplier name input */}
        <div className={styles.inputGroup}>
          <label>Supplier Name</label>
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            placeholder="Enter or search supplier"
            required
          />
          {suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map((name, i) => (
                <li key={i} onClick={() => setSupplierName(name)}>
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>Vessel Name</label>
          <input
            type="text"
            value={vesselName}
            onChange={(e) => setVesselName(e.target.value)}
            placeholder="Enter vessel name"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Invoice Number</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="Enter invoice number"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Invoice Date</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Attachment (PDF/Image)</label>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setAttachment(e.target.files?.[0] || null)}
          />
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Submitting..." : "Submit Invoice"}
        </button>
      </form>
    </div>
  );
}
