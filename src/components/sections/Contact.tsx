import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Github, Linkedin, Mail, ArrowUp, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

import { SectionWrapper } from '../../hoc';
import { config } from '../../constants/config';
import { Header } from '../atoms/Header';
import { Link } from 'react-router-dom';

const INITIAL_STATE = Object.fromEntries(
  Object.keys(config.contact.form).map(input => [input, ''])
);

const web3formsConfig = {
  accessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
  action: 'https://api.web3forms.com/submit',
};

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  useEffect(() => {
    // Initialization hook
  }, []);

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/jagath132',
      color: 'hover:text-white hover:bg-gray-800',
      gradient: 'from-gray-700 to-gray-900',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/jagath-r-naganathan/',
      color: 'hover:text-white hover:bg-blue-600',
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:${config.html.email}`,
      color: 'hover:text-white hover:bg-red-500',
      gradient: 'from-red-400 to-red-600',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com',
      color: 'hover:text-white hover:bg-sky-500',
      gradient: 'from-sky-400 to-sky-600',
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('access_key', web3formsConfig.accessKey);
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('message', form.message);

    try {
      const response = await fetch(web3formsConfig.action, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setLoading(false);
        setSuccess(true);
        setForm(INITIAL_STATE);
        setTimeout(() => setSuccess(false), 5000); // Hide success message after 5 seconds
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError(true);
      setTimeout(() => setError(false), 5000);
    }
  };

  return (
    <div className={`flex flex-col-reverse gap-10 overflow-hidden xl:mt-12 xl:flex-row`}>
      {success &&
        ReactDOM.createPortal(
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]">
            Thank you! Your message has been sent successfully.
          </div>,
          document.body
        )}
      {error &&
        ReactDOM.createPortal(
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]">
            Something went wrong. Please try again.
          </div>,
          document.body
        )}
      <div className="glass-card flex-[0.75] rounded-2xl p-8">
        <Header {...config.contact} />

        <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
          {Object.keys(config.contact.form).map(input => {
            const { span, placeholder } =
              config.contact.form[input as keyof typeof config.contact.form];
            const Component = input === 'message' ? 'textarea' : 'input';

            return (
              <label key={input} className="flex flex-col">
                <span className="mb-4 font-medium text-white">{span}</span>
                <Component
                  type={input === 'email' ? 'email' : 'text'}
                  name={input}
                  value={form[`${input}`]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="bg-white/5 placeholder:text-secondary rounded-lg border border-white/10 px-6 py-4 font-medium text-white outline-none focus:border-accent-cyan transition-colors"
                  {...(input === 'message' && { rows: 7 })}
                />
              </label>
            );
          })}
          <button
            type="submit"
            className="bg-tertiary shadow-primary w-fit rounded-xl px-8 py-3 font-bold text-white shadow-md outline-none"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      {/* Footer Section - Right Side */}
      <div className="flex-[0.25] flex flex-col items-center justify-center gap-6 rounded-2xl p-8">
        {/* Brand Section */}
        <div className="flex flex-col items-center gap-4">
          <Link to="/" onClick={scrollToTop} className="inline-block">
            <motion.div
              className="relative w-16 h-16 bg-gradient-to-br from-accent-cyan via-purple-500 to-accent-pink rounded-2xl flex items-center justify-center shadow-lg shadow-accent-cyan/30 transition-all duration-300"
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-display font-bold text-3xl tracking-wider">JR</span>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-cyan via-purple-500 to-accent-pink opacity-0 blur-lg"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </Link>
          <div className="text-center">
            <h3 className="text-white font-display font-bold text-lg">{config.html.fullName}</h3>
            <p className="text-secondary text-xs">{config.hero.p.join(' • ')}</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center gap-3">
          <h4 className="text-white font-display font-semibold text-sm">Connect</h4>
          <div className="flex gap-2">
            {socialLinks.map(social => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredSocial(social.name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  className={`relative group flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 overflow-hidden ${social.color}`}
                  aria-label={social.name}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{
                      y: hoveredSocial === social.name ? -3 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Icon size={18} className="transition-all duration-300" />
                  </motion.div>

                  {/* Animated Background */}
                  <motion.div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br ${social.gradient} opacity-0 blur-lg`}
                    animate={{
                      opacity: hoveredSocial === social.name ? 0.3 : 0,
                      scale: hoveredSocial === social.name ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Tooltip */}
                  <motion.span
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs rounded-md whitespace-nowrap border border-white/10 backdrop-blur-md"
                    animate={{
                      opacity: hoveredSocial === social.name ? 1 : 0,
                      y: hoveredSocial === social.name ? 0 : 5,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{
                      pointerEvents: hoveredSocial === social.name ? 'auto' : 'none',
                    }}
                  >
                    {social.name}
                  </motion.span>
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 border border-white/10 rounded-lg text-secondary hover:text-accent-cyan transition-all duration-300 overflow-hidden text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="font-medium">Back to Top</span>
          <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowUp size={14} />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, 'contact');
