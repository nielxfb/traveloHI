import React, { useEffect, useState } from "react";
import Button from "../button";
import { sendOTP } from "../../tools/send-otp";

interface IOTPButton {
  email: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

function ResendOTPButton({ email, setError }: IOTPButton) {
  const [cooldown, setCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const handleResendOTP = () => {
    setCooldown(true);
    setTimeLeft(30);

    try {
      sendOTP(email);
    } catch (error: any) {
      setError(error.message);
      return;
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown) {
      timer = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (timeLeft === 0) {
      setCooldown(false);
    }
  }, [timeLeft]);

  return (
    <Button onClick={handleResendOTP} disabled={cooldown}>
      {cooldown ? `Resend OTP (${timeLeft} seconds)` : "Resend OTP"}
    </Button>
  );
}

export default ResendOTPButton;
