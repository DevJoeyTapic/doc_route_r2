
import styles from "../styles/Dashboard.module.css";

export default function SubmitInvoice() {
  return (
    <>
      <h2 className={styles.pageTitle}>Submit Invoice</h2>
      <form className={styles.invoiceForm}>
        <div className={styles.formGroup}>
          <label>Invoice Number</label>
          <input type="text" placeholder="Enter invoice number" />
        </div>
        <div className={styles.formGroup}>
          <label>Invoice Date</label>
          <input type="date" />
        </div>
        <div className={styles.formGroup}>
          <label>Amount</label>
          <input type="number" placeholder="Enter amount" />
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <input type="text" placeholder="Enter description" />
        </div>
        <div className={styles.formGroup}>
          <label>Attachment</label>
          <input type="file" />
        </div>
        <div className={styles.formGroup}>
          <label>Remarks</label>
          <textarea placeholder="Enter remarks"></textarea>
        </div>
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
      </form>
    </>
  );
}
