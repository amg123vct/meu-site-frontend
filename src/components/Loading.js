import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Gamepad2 className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Carregando...
        </h2>
        <p className="text-white/80">
          Preparando sua experiência de jogo
        </p>
      </motion.div>
    </div>
  );
};

export default Loading; 