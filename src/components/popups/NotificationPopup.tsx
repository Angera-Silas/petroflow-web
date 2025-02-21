import { useState, useEffect } from "react";
import { XCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const icons = {
  success: <CheckCircle className="text-white" size={30} />, 
  error: <XCircle className="text-white" size={30} />, 
  info: <Info className="text-white" size={30} />, 
  warning: <AlertTriangle className="text-white" size={30} />,
};

const colors = {
  success: "bg-[#4CAF50]",
  error: "bg-[#f44336]",
  info: "bg-[#2196F3]",
  warning: "bg-[#FFC107]",
};

interface NotificationPopupProps {
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ title, message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`flex top-5 mx-30 justify-center p-4 rounded-lg shadow-md text-white flex items-center gap-4 ${colors[type]}`}>
      {icons[type]}
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xm">{message}</p>
      </div>
      <button onClick={onClose} className="ml-auto text-white">&times;</button>
    </div>
  );
};

export default NotificationPopup;
