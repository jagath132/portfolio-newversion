import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

import { styles } from '../../constants/styles';
import { config } from '../../constants/config';

const Typewriter = ({ texts }: { texts: string[] }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [delta, setDelta] = useState(300 - Math.random() * 100);

  const tick = useCallback(() => {
    const i = loopNum % texts.length;
    const fullText = texts[i];
    const updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(2000);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(200);
    } else {
      // Typing speed
      setDelta(100);
    }
  }, [text, isDeleting, loopNum, texts, setText, setIsDeleting, setLoopNum, setDelta]);

  useEffect(() => {
    const ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [delta, tick]);

  return (
    <span className="bg-gradient-to-r from-accent-cyan via-purple-500 to-accent-pink bg-clip-text text-transparent font-bold tracking-wide">
      {text}
      <span className="text-white animate-pulse ml-1">|</span>
    </span>
  );
};

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto flex flex-col items-center justify-center overflow-hidden bg-primary">
      {/* Background Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-pink/20 blur-[120px] animate-pulse-glow"
        style={{ animationDelay: '2s' }}
      />

      <div
        className={`${styles.paddingX} max-w-7xl mx-auto z-10 flex flex-col items-center text-center gap-6`}
      >
        {/* Intro Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10"
        >
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-secondary font-medium text-sm tracking-wider uppercase">
            Available for work
          </span>
        </motion.div>

        {/* Main Title */}
        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`${styles.heroHeadText} text-white font-sans tracking-tighter mb-4`}
          >
            Hi, I'm <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-[#00c6ff] via-[#0072ff] to-[#00c6ff] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-shift">
              {config.hero.name}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="min-h-[60px] flex items-center justify-center"
          >
            <p className="text-[20px] sm:text-[30px] font-display font-medium text-secondary">
              I am a <Typewriter texts={config.hero.p} />
            </p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <a
            href="#projects"
            onClick={e => {
              e.preventDefault();
              const element = document.getElementById('projects');
              if (element) {
                const yOffset = -80;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
                window.history.pushState(null, '', '#projects');
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-accent-cyan to-[#0072ff] rounded-xl font-bold text-white shadow-lg shadow-accent-cyan/25 hover:shadow-accent-cyan/40 hover:scale-105 transition-all duration-300"
            aria-label="View my projects"
          >
            View My Work
          </a>
          <a
            href="#contact"
            onClick={e => {
              e.preventDefault();
              const element = document.getElementById('contact');
              if (element) {
                const yOffset = -80;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
                window.history.pushState(null, '', '#contact');
              }
            }}
            className="px-8 py-4 glass-card border border-white/10 rounded-xl font-medium text-white hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300"
            aria-label="Contact me"
          >
            Contact Me
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 w-full flex justify-center items-center cursor-pointer"
      >
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary/30 flex justify-center items-start p-2 hover:border-accent-cyan/50 transition-colors duration-300">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
              className="w-3 h-3 rounded-full bg-accent-cyan mb-1 shadow-neon"
            />
          </div>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
