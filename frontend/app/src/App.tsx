import { useState } from "react";

function App() {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [locked, setLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const CORRECT_PIN = "1234";

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
      setMessage("PIN is locked. Try again later.");
      return;
    }

    const enteredPin = pin.join("");
    if (enteredPin === CORRECT_PIN) {
      setMessage("✅ PIN verified successfully!");
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setLocked(true);
        setMessage("❌ Too many attempts. Locked for 10 seconds.");
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
          setMessage("");
          setPin(["", "", "", ""]);
        }, 10000);
      } else {
        setMessage("❌ Invalid PIN. Try again.");
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
      <p>{message}</p>
    </div>
  );
}

export default App;
