import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  useEffect(() => {
    // Initialization hook
  }, []);

  return (
    <footer className="relative bg-gradient-to-b from-black/20 via-black/40 to-black/80 backdrop-blur-lg border-t border-white/10 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-purple-500/5 to-accent-pink/5 animate-gradient-shift opacity-30" />

      {/* Radial Gradient Background */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-br from-accent-cyan to-purple-500 rounded-full shadow-lg shadow-accent-cyan/20"
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Corner Accent */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-accent-cyan/10 to-transparent rounded-tl-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-br-full blur-3xl pointer-events-none" />
    </footer>
  );
};

export default Footer;
