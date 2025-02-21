/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../components/popups/NotificationPopup";
import TextInputField from "../components/inputs/TextInputField";
import Button from "../components/buttons/Button";
import { postRequest } from "../utils/api";

interface ResetPasswordProps {
  theme: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ theme }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Steps: 1 = Enter Email, 2 = Verify Code, 3 = Reset Password
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState<{ title: string; message: string; type: "error" | "success" | "info" | "warning" } | null>(null);

  // Step 1: Send OTP to the entered email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setNotification({ title: "Error", message: "Please enter your email address.", type: "error" });
      return;
    }

    setNotification({ title: "Info", message: "Sending OTP...", type: "info" });

    try {
      // Ensure the request body matches the expected DTO
      const response = await postRequest("/email/send-otp", { to: email }); 

      setGeneratedCode(response); // Store the OTP returned by the backend

      setNotification({ title: "Success", message: "Verification code sent! Check your email.", type: "success" });
      setStep(2);
    } catch (error: any) {
      setNotification({ title: "Error", message: error.message, type: "error" });
    }
  };


  // Step 2: Verify the OTP
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationCode !== generatedCode) {
      setNotification({ title: "Error", message: "Invalid verification code.", type: "error" });
      return;
    }

    setNotification({ title: "Success", message: "Code verified! Set your new password.", type: "success" });
    setStep(3);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setNotification({ title: "Error", message: "Password must be at least 6 characters.", type: "error" });
      return;
    }

    try {
      // Reset the password using the backend API
      if(confirmPassword == newPassword){
        await postRequest("/users/update-password", { username: email, newPassword });
      }

      setNotification({ title: "Success", message: "Password reset successful! Redirecting to login...", type: "success" });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setNotification({ title: "Error", message: error.message, type: "error" });
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen bg-cover bg-center ${theme}`}>
      <div className="absolute top-1/4 z-30 p-4">
        {notification && (
          <NotificationPopup
            title={notification.title}
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
      <div className="w-full max-w-md p-8 border border-gray-200 bg-white/20 backdrop-blur-md rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-2">PetroFlow</h1>
        <h2 className="text-xl text-white text-center mb-6">Reset Password</h2>
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <p>Please enter your email below to recive a verification code: </p>
            <TextInputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required name="email" theme={theme} />
            <Button type="submit">Send Verification Code</Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p>A verification code has been sent to your email. Enter the code below:</p>
            <TextInputField label="Verification Code" type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required name="code" theme={theme} />
            <Button type="submit">Verify Code</Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p>Set New Password:</p>

            <TextInputField label="Old Password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required name="oldPassword" theme={theme} />

            <TextInputField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required name="newPassword" theme={theme} />

            <TextInputField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required name="confirmPassword" theme={theme} />
            <Button type="submit">Save</Button>
          </form>
        )}

        <p className="text-white text-center text-sm mt-4">
          Remembered your password?{" "}
          <button onClick={() => navigate("/login")} className="font-semibold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
