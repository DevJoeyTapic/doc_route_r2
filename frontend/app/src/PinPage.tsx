import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import axios from "axios";

function PinPage() {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
   
    const enteredPin = pin.join("");
    if (enteredPin.length < 4) {
      toast.warning("Enter all 4 digits.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/api/verify-pin/", {
          pin_code: enteredPin,
      });
      console.log("✅ API Response:", response.data); // show full JSON in console

      toast.success("PIN verified successfully!");
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);

      setPin(["", "", "", ""]);
      setTimeout(() => navigate("/dashboard"), 1000);
    } 
    catch (error: any) {
      if (error.response?.status === 401) {
            toast.error("Invalid PIN.");
      } else {
            toast.error("Account locked.");
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
      <button onClick={handleSubmit}>
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
