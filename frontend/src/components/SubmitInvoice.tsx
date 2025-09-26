import { useState, useEffect } from "react";
import styles from "../styles/Dashboard.module.css";

export default function SubmitInvoice() {
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [amount, setAmount] = useState<string>(""); // formatted for UI
  const [rawAmount, setRawAmount] = useState<number>(0); // numeric for saving
  
  // Autofill date with today’s date
  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0]; // YYYY-MM-DD
    setInvoiceDate(formatted);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, ""); // remove all non-digits
    if (value) {
      const num = parseFloat(value) / 100; // turn "1000" to 10.00
      setRawAmount(num);
      const formatted = num.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
      });
      setAmount(formatted);
    } else {
      setRawAmount(0);
      setAmount("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      invoiceDate,
      amountFormatted: amount,
      amountRaw: rawAmount,
    });
    // Send rawAmount to your API if saving to DB
  };  


  return (
    <>
      <form className={styles.invoiceForm} onSubmit={handleSubmit}>
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
          <input type="text" placeholder="Enter invoice number" />
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
          <input type="text" placeholder="Enter description" />
        </div>
        <div className={styles.formGroup}>
          <label>Attachment</label>
          <input type="file" />
        </div>
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
      </form>
    </>
  );
}
