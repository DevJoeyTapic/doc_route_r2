import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import axios from "axios";

function PinPage() {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [locked, setLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const CORRECT_PIN = "1234";
  const MAX_ATTEMPTS = 3;
  const LOCK_TIMEOUT = 10000; // 10 seconds

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // auto focus next
      if (value && index < pin.length - 1) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = () => {
    if (locked) {
      toast.error("PIN is locked. Try again later.");
      return;
    }

    const enteredPin = pin.join("");
    if (enteredPin.length < 4) {
      toast.warning("⚠️ Enter all 4 digits.");
      return;
    }
    if (enteredPin === CORRECT_PIN) {
      toast.success("PIN verified successfully!");
      setAttempts(0);
      setPin(["", "", "", ""]);
      setTimeout(() => navigate("/dashboard"), 1000); // Redirect after 1s
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
        toast.error("Too many attempts. Locked for 10 seconds.");
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
          setPin(["", "", "", ""]);
        }, LOCK_TIMEOUT);
      } else {
        toast.error("Invalid PIN. Try again.");
      }
    }
  };

  return (
    <div className="container">
      <h1>PIN Verification</h1>
      <div className="pin-inputs">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            type="password"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
          />
        ))}
      </div>
      <button onClick={handleSubmit} disabled={locked}>
        Verify PIN
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
