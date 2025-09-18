import { useState, useRef, FormEvent, useEffect } from "react";

export default function PinLogin() {
  const PIN_LENGTH = 4;
  const STATIC_PIN = "1234"; // Hardcoded PIN for demo
  const MAX_ATTEMPTS = 3;
  const LOCK_TIME = 30; // seconds

  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [message, setMessage] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [locked, setLocked] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Countdown effect
  useEffect(() => {
    if (locked && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (locked && timeLeft === 0) {
      setLocked(false);
      setAttempts(0);
      setMessage("🔓 You can try again now.");
    }
  }, [locked, timeLeft]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < PIN_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (locked) {
      setMessage(`🔒 Locked. Please wait ${timeLeft}s`);
      return;
    }

    const enteredPin = digits.join("");

    if (enteredPin === STATIC_PIN) {
      setMessage("✅ PIN verified successfully!");
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
        setTimeLeft(LOCK_TIME);
        setMessage(`🔒 Too many failed attempts. Locked for ${LOCK_TIME} seconds.`);
      } else {
        setMessage(`❌ Invalid PIN. Attempts left: ${MAX_ATTEMPTS - newAttempts}`);
      }
    }

    setDigits(Array(PIN_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Enter PIN</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <div className="flex gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                type="password"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                disabled={locked}
                className={`w-14 h-14 text-center text-2xl border rounded-lg focus:outline-none ${
                  locked ? "bg-gray-200 cursor-not-allowed" : "focus:ring focus:border-blue-300"
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={locked}
            className={`py-3 px-6 rounded-lg text-white transition ${
              locked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Verify PIN
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("🔓")
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
