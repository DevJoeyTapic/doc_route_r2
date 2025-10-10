import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/Dashboard.module.css";

interface SubmitInvoiceProps {
  supplierId: string | null;
  accessToken: string | null;
}

interface Vessel {
  vessel_id: string;
  vessel_name: string;
}

export default function SubmitInvoice({
  supplierId,
  accessToken
}:SubmitInvoiceProps
) {
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [vesselName, setVesselName] = useState<string>("");
  const [vesselSuggestions, setVesselSuggestions] = useState<Vessel[]>([]);
  const [selectedVesselId, setSelectedVesselId] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>(""); // formatted for UI
  const [rawAmount, setRawAmount] = useState<number>(0); // numeric for saving
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [invoiceExists, setInvoiceExists] = useState<boolean | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
 

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const suggestionBoxRef = useRef<HTMLDivElement | null>(null);
  const vesselInputRef = useRef<HTMLInputElement | null>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  
  // ----------------------------
  // Auto scroll highlighted suggestion
  // ----------------------------
  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionRefs.current[highlightedIndex]) {
      suggestionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);


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

  // ---------- File ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachment(file);
  };

  // ---------- Check Invoice Number ----------
  const handleInvoiceBlur = async () => {
    if (!invoiceNumber.trim() || !accessToken) return;

    setIsChecking(true);
    try {
      const response = await fetch(
        `http://localhost:8000/invoices/check-invoice/?invoice_number=${encodeURIComponent(
          invoiceNumber
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Server error while checking invoice");
      }

      const data = await response.json();
      if (data.exists) {
        setInvoiceExists(true);
        toast.warning("Invoice number already exists!");
      }else {
        setInvoiceExists(false);
      }
    } catch (err) {
      toast.error("Failed to check invoice number");
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  // ---------------------------
  // - Validation using toast  -
  // ---------------------------
  const validate = () => {
    let isValid = true;

    if (!invoiceDate) {
      toast.error("Date is required");
      isValid = false;
    }
    if (!vesselName.trim()) {
      toast.error("Vessel name is required");
      isValid = false;
    }
    if (!selectedVesselId) {
      toast.error("Please select a valid vessel from suggestions");
      return false;
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

  //  ---------------------------
  //  -        Submit Form      -
  //  ---------------------------        
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("supplier_id", supplierId ?? "");
      formData.append("submitted_date", invoiceDate);
      formData.append("vessel", selectedVesselId);
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
    } catch (error:any) {
      console.error("Upload error:", error);
      try {
        const parsed = typeof error.message === "string" ? JSON.parse(error.message): {};

        if (parsed.invoice_number) {
            toast.error(parsed.invoice_number[0]);
        } else if (parsed.detail) {
            toast.error(parsed.detail);
        } else {
            toast.error("Failed to submit invoice");
        }
      } catch (e){
        toast.error("Failed to submit invoice");
      }
      
    } finally {
      setIsSubmitting(false);
    };
  };  

  // -------------------- Styles for Validation --------------------
  const getInvoiceInputStyle = () => {
    if (invoiceExists === true)
      return { border: "2px solid red", backgroundColor: "#ffe6e6" };
    return {};
  };
  // ---------------------------------------------
  //                     JSX                     -
  // ---------------------------------------------
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

         <div className={styles.formGroup} style={{ position: "relative" }} >
          <label>Vessel Name</label>
          <input
            ref={vesselInputRef}
            type="text"
            placeholder="Start typing vessel name..."
            value={vesselName}
            onChange={handleVesselInput}
            onKeyDown={(e) => {
                if (vesselSuggestions.length === 0) return;

                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev < vesselSuggestions.length - 1 ? prev + 1 : 0
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev > 0 ? prev - 1 : vesselSuggestions.length - 1
                  );
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (highlightedIndex >= 0) {
                    const selected = vesselSuggestions[highlightedIndex];
                    handleSuggestionClick(selected.vessel_name,selected.vessel_id);
                    setHighlightedIndex(-1);
                  }
                } else if (e.key === "Escape") {
                  setHighlightedIndex(-1);
                  setVesselSuggestions([]);
                }
              }}
          />
          {vesselSuggestions.length > 0 && (
            <div
              ref={suggestionBoxRef}
              className={styles.suggestionBox}
              style={{
                position: "absolute",
                top: `${(vesselInputRef.current?.offsetHeight || 0) + 22}px`,
                left: 0,
                background: "white",
                border: "1px solid #ccc",
                width: vesselInputRef.current?.offsetWidth || "100%",
                zIndex: 10,
                maxHeight: "150px",
                overflowY: "auto",
                borderRadius: "6px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                fontSize: "0.9rem", 
              }}
            >
              {vesselSuggestions.map((v,index) => (
                <div
                  key={v.vessel_id}
                  ref={(el) => {suggestionRefs.current[index] = el}}
                  onClick={() => handleSuggestionClick(v.vessel_name,v.vessel_id)}
                  style={{
                    padding: "8px 10px",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    backgroundColor:
                      index === highlightedIndex ? "#e8f0fe" : "white", // highlight active item
                  }}
                  onMouseDown={(e) => e.preventDefault()} // prevent input blur
                  onMouseEnter={(e) => {
                    (e.target as HTMLDivElement).style.backgroundColor = "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLDivElement).style.backgroundColor = "white";
                  }}
                >
                  {v.vessel_name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>Invoice Number</label>
          <input 
            type="text" 
            placeholder="Enter invoice number" 
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            onBlur={handleInvoiceBlur}
            style={getInvoiceInputStyle()}
          />
          {isChecking && <small>Checking...</small>}
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
