import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/Dashboard.module.css";

export default function SubmitInvoice() {
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>(""); // formatted for UI
  const [rawAmount, setRawAmount] = useState<number>(0); // numeric for saving
  
  // Autofill date with today’s date
  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0]; // YYYY-MM-DD
    setInvoiceDate(formatted);
  }, []);

  // Handle live amount formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    value = value.replace(/[^0-9]/g, ""); // keep only digits

    // Prevent multiple dots
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts[1];
    }

    const num = parseFloat(value);

    if (!isNaN(num)) {
      setRawAmount(num);

      // Format as PHP currency without changing user cursor position too aggressively
      const formatted = num.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setAmount(formatted);
    } else {
      setRawAmount(0);
      setAmount("");
    }
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

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log({
      invoiceDate,
      invoiceNumber,
      description,
      amountFormatted: amount,
      amountRaw: rawAmount,
    });

    toast.success("Invoice submitted successfully!");
    // Send rawAmount to your API if saving to DB
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
          <input type="file" />
        </div>
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
