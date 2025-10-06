import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/Dashboard.module.css";

interface SubmitInvoiceProps {
  supplierId: string | null;
  accessToken: string | null;
}

export default function SubmitInvoice({
  supplierId,
  accessToken
}:SubmitInvoiceProps
) {
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>(""); // formatted for UI
  const [rawAmount, setRawAmount] = useState<number>(0); // numeric for saving
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Autofill date with today’s date
  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0]; // YYYY-MM-DD
    setInvoiceDate(formatted);
  }, []);

  // Handle live amount formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only digits and up to one decimal point, 2 decimals max
    const regex = /^(\d+(\.\d{0,2})?)?$/;

    if (regex.test(value)) {
      setAmount(value); // keep typed string as-is
      setRawAmount(parseFloat(value) || 0);
    }
  };

  const handleAmountFocus = () => {

    // Strip formatting back to plain number
    if (rawAmount) {
      setAmount(rawAmount.toString());
    }
  };
// On blur, format as PHP currency
  const handleAmountBlur = () => {

    if (!rawAmount) {
      setAmount("");
      return;
    }

    setAmount(
        rawAmount.toLocaleString("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
    );

  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachment(file);
  };

  // Validation using toast
  const validate = () => {
    let isValid = true;

    if (!invoiceDate) {
      toast.error("Date is required");
      isValid = false;
    }
    if (!invoiceNumber.trim()) {
      toast.error("Invoice number is required");
      isValid = false;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      isValid = false;
    }
    if (rawAmount <= 0) {
      toast.error("Amount must be greater than 0");
      isValid = false;
    }
    // Validate file attachment
    if (!attachment) {
      toast.error("Attachment is required");
      isValid = false;
    } else if (attachment.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("supplier_id", supplierId ?? "");
      formData.append("submitted_date", invoiceDate);
      formData.append("invoice_number", invoiceNumber);
      formData.append("description", description);
      formData.append("amount_due", rawAmount.toString());
      if (attachment) formData.append("pdf_file", attachment);

      const response = await fetch("http://localhost:8000/invoices/upload/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      toast.success("Invoice submitted successfully!");
      // Reset form
      setInvoiceDate(new Date().toISOString().split("T")[0]);
      setInvoiceNumber("");
      setDescription("");
      setAmount("");
      setRawAmount(0);
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to submit invoice");
    } finally {
      setIsSubmitting(false);
    };
  };  


  return (
    <>
      <form className={styles.invoiceForm} onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label>Date</label>
          <input 
            id="invoiceDate"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Invoice Number</label>
          <input 
            type="text" 
            placeholder="Enter invoice number" 
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Amount</label>
          <input 
            id="amount"
            type="text"
            placeholder="₱0.00"
            value={amount}
            onChange={handleAmountChange}
            onFocus={handleAmountFocus}
            onBlur={handleAmountBlur}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <input 
            type="text" 
            placeholder="Enter description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Attachment</label>
          <input 
            ref={fileInputRef}
            type="file"
            accept="application/pdf" 
            onChange={handleFileChange}
          />
        </div>
        <button 
           type="submit" 
           className={styles.submitBtn}
           disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
