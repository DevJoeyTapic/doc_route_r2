import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/PinPage.module.css";


function PinPage() {
  const PIN_LENGTH = 6;
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Handle input change
  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < PIN_LENGTH - 1) {
        pinRefs.current[index + 1]?.focus();
      } 
    }
  };

  // Handle keyboard navigation per input
 const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (pin[index] === "" && index > 0) {
        pinRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      pinRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < PIN_LENGTH - 1) {
      pinRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Submit PIN
  const handleSubmit = async () => {
    const enteredPin = pin.join("");
    if (enteredPin.length < PIN_LENGTH) {
      toast.warning("Enter all 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/verify-pin/", {
          pin_code: enteredPin,
      });
      console.log("✅ API Response:", response.data); // show full JSON in console

      toast.success("PIN verified successfully!", {
        onClose: () => setPin(Array(PIN_LENGTH).fill("")),
      });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("supplier_id", response.data.supplier_id);

      setTimeout(() => navigate("/dashboard"), 500);
    } 
    catch (error: any) {
      if (error.response?.status === 401) {
            toast.error("Invalid PIN.");
      } else {
            toast.error("Account locked.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  // Tab/Shift+Tab loop & Enter handling
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusable = [...pinRefs.current, buttonRef.current].filter(Boolean) as HTMLElement[];
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement as HTMLElement;

        if (e.shiftKey && current === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [pin]);


   // Autofocus first input on mount
   useEffect(() => {
    pinRefs.current[0]?.focus();
  }, []);


  return (
    <div className={styles.container}>
      <h1>PIN Verification</h1>
      <div className={styles.pinInputs}>
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            type="password"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDownInput(e, idx)}
            className={styles.pinInput}
            ref={(el) => {pinRefs.current[idx] = el}}
          />
        ))}
      </div>
      <button 
         ref={buttonRef} 
         onClick={handleSubmit} 
         className={styles.button}
         disabled={loading}
      >
        {loading ? (
          <div className={styles.btnContent}>
              <div className={styles.spi}>
              Verifying... 
              </div>
          </div>
        ): (
          "Submit"
        )}
      </button>

      {/* Toast container */}
      <ToastContainer 
           position="top-right" 
           autoClose={2000} 
           hideProgressBar={false}
           newestOnTop={true}
           closeOnClick 
           pauseOnFocusLoss={false}
      />
    </div>
  );
}

export default PinPage;
