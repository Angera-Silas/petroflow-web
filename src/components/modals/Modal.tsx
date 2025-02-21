import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  theme: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, theme }) => {
  if (!open) return null;

  const themeClasses = theme === "dark" ? "bg-gray-900 text-dark-text" : "bg-white text-light-text";
  const overlayClasses = theme === "dark" ? "bg-black bg-opacity-50" : "bg-gray-500 bg-opacity-50";

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${overlayClasses}`}>
      <div className={`p-5 rounded-lg shadow-lg w-1/2 ${themeClasses} border border-gray-600`}> 
        <button onClick={onClose} className="float-right text-2xl font-bold" aria-label="Close Modal">
          &times;
        </button>  
        {children}
      </div>
    </div>
  );
};

export default Modal;
