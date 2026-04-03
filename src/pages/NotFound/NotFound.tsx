/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // or use window.history.back() if not using React Router
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Goes back one step in history
  };

  // Animation variants
  const containerVariants:any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants:any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation:any = {
    y: [-8, 8, -8],
    transition: {
      y: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut"
      }
    }
  };

  const pulseAnimation:any = {
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated 404 Number */}
        <motion.div
          className="relative mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="text-9xl font-bold text-blue-100 absolute inset-0"
            animate={floatingAnimation}
          >
            404
          </motion.div>
          <motion.div
            className="relative z-10"
            animate={pulseAnimation}
          >
            <FiAlertTriangle className="text-6xl text-amber-400 mx-auto mb-4 drop-shadow-sm" />
            <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
              404
            </h1>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-4"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-gray-600 text-lg mb-8 leading-relaxed"
          variants={itemVariants}
        >
          Oops! The page you're looking for seems to have wandered off into the digital void.
        </motion.p>

        {/* Go Back Button */}
        <motion.div
          variants={itemVariants}
        >
          <motion.button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200 mx-auto cursor-pointer"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft className="text-xl" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Subtle Decorative Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-40"
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-cyan-300 rounded-full opacity-40"
          animate={{
            y: [0, 25, 0],
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-200 rounded-full opacity-30"
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </motion.div>
    </div>
  );
};

export default NotFound;