import React from "react";

interface FooterProps {
  theme: string;
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer
      className={`flex flex-col justify-center items-center p-4 shadow-md border-t ${
        theme === "dark"
          ? "bg-dark-background text-dark-text border-gray-700"
          : "bg-light-background border-gray-300 text-light-text"
      }`}
    >
      <p className="text-sm">&copy; 2025 PetroFlow. All Rights Reserved.</p>
      <p className="text-xs">Powered By AngiSoft Technologies.</p>
    </footer>
  );
};

export default Footer;
