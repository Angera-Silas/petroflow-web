import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface NotFoundProps {
  theme: string; // Required string
}

const NotFound = ({ theme }: NotFoundProps) => {
  const isDark = theme === "dark";

  return (
    <div className={`flex gap-10 items-center justify-center h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <AlertCircle className="w-30 h-30 item-center text-red-500" />
    <div
      className={`flex flex-col items-center justify-center`}
    >
      <motion.h1
        className="text-9xl font-extrabold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-transparent bg-clip-text "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-4xl mt-4 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 text-transparent bg-clip-text font-semibold pb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Page Not Found
      </motion.p>
    </div>
    </div>
    
  );
};

export default NotFound;
