import { motion } from "framer-motion";

export default function LoadingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-gradient-to-br from-blue-500 to-green-400 p-8 rounded-lg">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-40 h-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.path
            d="M52,116.125 L15,90 L100,10 L170,90 L135.2,110.25 L155,150 L170,170 L140,170 L155,150"
            stroke="white"
            strokeWidth="5"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M60,140 L55,70 C80,120 82,123 110,110 Q122,30 120,145"
            stroke="white"
            strokeWidth="5"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M51,66 C70,60 120,50 120,60"
            stroke="white"
            strokeWidth="7"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}