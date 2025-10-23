import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import styles from "../styles/Dashboard.module.css";

interface Props {
  accessToken: string | null;
}

interface Vessel {
  vessel_id: string;
  vessel_name: string;
}

export default function StaffSubmitInvoice({ 
  accessToken 
}: Props
) {
  const [supplierName, setSupplierName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [vesselName, setVesselName] = useState("");
  const [vesselSuggestions, setVesselSuggestions] = useState<Vessel[]>([]);
  const [selectedVesselId, setSelectedVesselId] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  
  const [amount, setAmount] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);


  const suggestionBoxRef = useRef<HTMLDivElement | null>(null);
  const vesselInputRef = useRef<HTMLInputElement | null>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);


  // --------------------------------------------------------
  //           Fetch vessels as user types                  -
  // --------------------------------------------------------
  
  const handleVesselInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVesselName(value);

    if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => { 
      if (value.length < 1 || !accessToken) {
        setVesselSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/vessels/?search=${encodeURIComponent(value)}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!response.ok) throw new Error("Failed to load vessels");

        const data = await response.json();
        setVesselSuggestions(data);
      } catch (error) {
        console.error("Error fetching vessels:", error);
      }
    },300);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // ---------------------------------------------------------
  //             When user clicks a suggestion               -
  // ---------------------------------------------------------
  const handleSuggestionClick = (name: string, id: string) => {
    setVesselName(name);
    setVesselSuggestions([]);
    setSelectedVesselId(id);
  };

  // Hide suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(e.target as Node) &&
        vesselInputRef.current &&
        !vesselInputRef.current.contains(e.target as Node)
      ) {
        setVesselSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync width of suggestion box with input
  useEffect(() => {
    const updateWidth = () => {
      if (vesselInputRef.current && suggestionBoxRef.current) {
        suggestionBoxRef.current.style.width = `${vesselInputRef.current.offsetWidth}px`;
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [vesselSuggestions.length]);
  
  // ----------------------------------------
  //   Auto scroll highlighted suggestion   -
  // ----------------------------------------
  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionRefs.current[highlightedIndex]) {
      suggestionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

// -------------------------------------
  // -  Autofill date with today’s date  -
  // ------------------------------------- 
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1); // months are 0-based
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());


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
    <div>

      <form className={styles.invoiceForm} onSubmit={handleSubmit} noValidate>
         <div className={styles.inputGroup}>
          <label>Invoice Date</label>
          <input
            id="invoiceDate"
            type="datetime-local"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>

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
