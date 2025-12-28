import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { navLinks } from '../../constants';
import { menu, close } from '../../assets';

const Navbar = () => {
  const [active, setActive] = useState<string | null>('');
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Active Highlight Logic
    const navbarHighlighter = () => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(current => {
        const sectionId = current.getAttribute('id');
        // @ts-ignore
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.getBoundingClientRect().top - sectionHeight * 0.2;

        if (sectionTop < 0 && sectionTop + sectionHeight > 0) {
          setActive(sectionId);
          // Update URL hash without scrolling
          if (window.location.hash !== `#${sectionId}`) {
            window.history.replaceState(null, '', `#${sectionId}`);
          }
        }
      });
    };

    window.addEventListener('scroll', navbarHighlighter);

    // Set initial active state based on URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
      setActive(hash);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', navbarHighlighter);
    };
  }, []);

  useEffect(() => {
    if (!location.hash) {
      setActive('');
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <nav
      className={`fixed z-50 flex w-full items-center justify-center transition-all duration-100 ${scrolled ? 'top-0 py-3' : 'top-0 py-5 sm:top-4'
        }`}
    >
      <div
        className={`flex w-full max-w-7xl items-center justify-between mx-auto transition-all duration-100 ${scrolled
          ? 'px-6 py-2 bg-black/40 backdrop-blur-xl border-b border-white/5 w-full rounded-none'
          : 'px-6 py-3 bg-black/20 backdrop-blur-lg border border-white/10 w-[95%] sm:rounded-2xl shadow-lg shadow-black/20'
          }`}
      >
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive('');
            window.scrollTo(0, 0);
          }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan via-purple-500 to-accent-pink rounded-xl flex items-center justify-center shadow-lg shadow-accent-cyan/20">
            <span className="text-white font-display font-bold text-lg tracking-wider">JR</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden sm:flex flex-row gap-8">
          {navLinks.map(nav => (
            <li
              key={nav.id}
              className={`relative cursor-pointer text-[16px] font-medium transition-colors duration-100 font-display ${active === nav.id ? 'text-accent-cyan' : 'text-secondary hover:text-white'
                }`}
            >
              <a
                href={`#${nav.id}`}
                className="relative z-10 px-2 py-1"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(nav.id);
                  const element = document.getElementById(nav.id);
                  if (element) {
                    const yOffset = -80; // Navbar height offset
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    window.history.pushState(null, '', `#${nav.id}`);
                  }
                }}
              >
                {nav.title}
              </a>
              {active === nav.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-gradient-to-r from-accent-cyan via-purple-500 to-accent-pink rounded-full shadow-lg shadow-accent-cyan/50"
                  transition={{ type: "spring", bounce: 0.1, duration: 0.1 }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Menu */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[24px] h-[24px] object-contain cursor-pointer relative z-50 opacity-90 hover:opacity-100 transition-opacity"
            onClick={() => setToggle(!toggle)}
          />

          <AnimatePresence>
            {toggle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.1, type: "spring", bounce: 0.1 }}
                className="absolute top-16 right-4 mx-4 my-2 min-w-[200px] z-40 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="p-6">
                  <ul className="list-none flex justify-end items-start flex-col gap-4">
                    {navLinks.map((nav, index) => (
                      <motion.li
                        key={nav.id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.03 * index }}
                        className={`font-display font-medium cursor-pointer text-[18px] w-full ${active === nav.id ? 'text-accent-cyan' : 'text-secondary'
                          }`}
                        onClick={() => {
                          setToggle(!toggle);
                          setActive(nav.id);
                        }}
                      >
                        <a
                          href={`#${nav.id}`}
                          className="block w-full py-2 px-4 hover:bg-white/5 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(nav.id);
                            if (element) {
                              const yOffset = -80;
                              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                              window.history.pushState(null, '', `#${nav.id}`);
                            }
                          }}
                        >
                          {nav.title}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
