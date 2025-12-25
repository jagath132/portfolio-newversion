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
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSubmission, setPendingSubmission] = useState<any>(null);

  useEffect(() => {
    // Online/Offline detection
    const handleOnline = () => {
      setIsOnline(true);
      // Retry pending submission if exists
      if (pendingSubmission) {
        submitForm(pendingSubmission);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSubmission]);

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
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name || form.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!form.email || form.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!form.message || form.message.trim() === '') {
      errors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitForm = async (formData: FormData) => {
    try {
      const response = await fetch(web3formsConfig.action, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setLoading(false);
        setSuccess(true);
        setError(false);
        setErrorMessage('');
        setForm(INITIAL_STATE);
        setPendingSubmission(null);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (err: any) {
      setLoading(false);
      setError(true);
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
      console.error('Form submission error:', err);
      setTimeout(() => {
        setError(false);
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setError(true);
      setErrorMessage('Please fix the errors in the form');
      setTimeout(() => {
        setError(false);
        setErrorMessage('');
      }, 3000);
      return;
    }

    // Check if online
    if (!isOnline) {
      setError(true);
      setErrorMessage('You are offline. Your message will be sent when you reconnect.');
      const formData = new FormData();
      formData.append('access_key', web3formsConfig.accessKey);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('message', form.message);
      setPendingSubmission(formData);
      setTimeout(() => {
        setError(false);
        setErrorMessage('');
      }, 5000);
      return;
    }

    setLoading(true);
    setError(false);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('access_key', web3formsConfig.accessKey);
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('message', form.message);

    await submitForm(formData);
  };

  return (
    <div className={`flex flex-col-reverse gap-10 overflow-hidden xl:mt-12 xl:flex-row`}>
      {success &&
        ReactDOM.createPortal(
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Thank you! Your message has been sent successfully.
          </div>,
          document.body
        )}
      {error &&
        ReactDOM.createPortal(
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {errorMessage || 'Something went wrong. Please try again.'}
          </div>,
          document.body
        )}
      {!isOnline &&
        ReactDOM.createPortal(
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            You are currently offline
          </div>,
          document.body
        )}
      <motion.div
        className="glass-card flex-[0.75] rounded-2xl p-8 border border-white/10 relative overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-cyan/10 to-purple-500/10 rounded-full blur-3xl -z-10" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent-pink/10 to-blue-500/10 rounded-full blur-3xl -z-10" aria-hidden="true" />

        <Header {...config.contact} />

        <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6" noValidate>
          {Object.keys(config.contact.form).map((input, index) => {
            const { span, placeholder } =
              config.contact.form[input as keyof typeof config.contact.form];
            const Component = input === 'message' ? 'textarea' : 'input';

            return (
              <motion.label
                key={input}
                className="flex flex-col group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="mb-3 font-semibold text-white flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-accent-cyan to-purple-500 rounded-full" aria-hidden="true" />
                  {span}
                  <span className="text-accent-pink">*</span>
                </span>
                <div className="relative">
                  <Component
                    type={input === 'email' ? 'email' : 'text'}
                    name={input}
                    value={form[`${input}`]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full bg-black/20 placeholder:text-secondary/60 rounded-xl border-2 ${validationErrors[input]
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-accent-cyan/50'
                      } px-6 py-4 font-medium text-white outline-none transition-all duration-300 backdrop-blur-sm
                    hover:bg-black/30 hover:border-white/20
                    focus:bg-black/40 focus:shadow-lg focus:shadow-accent-cyan/20`}
                    {...(input === 'message' && { rows: 7 })}
                    required
                    aria-invalid={!!validationErrors[input]}
                    aria-describedby={validationErrors[input] ? `${input}-error` : undefined}
                  />
                  {/* Focus indicator */}
                  <div className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${validationErrors[input] ? 'opacity-0' : 'opacity-0 group-focus-within:opacity-100'
                    }`} aria-hidden="true">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-cyan/20 to-purple-500/20 blur-sm" />
                  </div>
                </div>
                {validationErrors[input] && (
                  <motion.span
                    id={`${input}-error`}
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                    role="alert"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {validationErrors[input]}
                  </motion.span>
                )}
              </motion.label>
            );
          })}
          <motion.button
            type="submit"
            disabled={loading || !isOnline}
            className="relative group w-fit rounded-xl px-10 py-4 font-bold text-white shadow-lg outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-4"
            aria-busy={loading}
            whileHover={{ scale: loading || !isOnline ? 1 : 1.05 }}
            whileTap={{ scale: loading || !isOnline ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-purple-500 to-accent-pink transition-opacity duration-300 group-hover:opacity-90" aria-hidden="true" />

            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" aria-hidden="true" />

            {/* Button content */}
            <span className="relative flex items-center gap-2">
              {loading && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Sending...' : !isOnline ? 'Offline' : 'Send Message'}
              {!loading && isOnline && (
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </span>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-accent-cyan/50 blur-xl -z-10" aria-hidden="true" />
          </motion.button>
        </form>
      </motion.div>

      {/* Footer Section - Right Side */}
      <motion.div
        className="flex-[0.25] flex flex-col items-center justify-center gap-8 rounded-2xl p-8 glass-card border border-white/10 relative overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Decorative gradient background */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-accent-cyan/10 rounded-full blur-3xl -z-10" aria-hidden="true" />

        {/* Brand Section */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link to="/" onClick={scrollToTop} className="inline-block">
            <motion.div
              className="relative w-20 h-20 bg-gradient-to-br from-accent-cyan via-purple-500 to-accent-pink rounded-2xl flex items-center justify-center shadow-xl shadow-accent-cyan/30 transition-all duration-300 border border-white/20"
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-display font-bold text-4xl tracking-wider">JR</span>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-cyan via-purple-500 to-accent-pink opacity-0 blur-xl"
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </Link>
          <div className="text-center">
            <h3 className="text-white font-display font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{config.html.fullName}</h3>
            <p className="text-secondary text-sm mt-1">{config.hero.p.join(' • ')}</p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />

        {/* Social Links */}
        <motion.div
          className="flex flex-col items-center gap-4 w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h4 className="text-white font-display font-semibold text-base flex items-center gap-2">
            <span className="w-1 h-4 bg-gradient-to-b from-accent-cyan to-purple-500 rounded-full" aria-hidden="true" />
            Connect With Me
          </h4>
          <div className="flex gap-3 flex-wrap justify-center">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredSocial(social.name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  className={`relative group flex items-center justify-center w-12 h-12 rounded-xl bg-black/20 border-2 border-white/10 transition-all duration-300 overflow-hidden backdrop-blur-sm ${social.color}`}
                  aria-label={social.name}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    animate={{
                      y: hoveredSocial === social.name ? -2 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon size={20} className="transition-all duration-300 relative z-10" />
                  </motion.div>

                  {/* Animated Background */}
                  <motion.div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${social.gradient} opacity-0`}
                    animate={{
                      opacity: hoveredSocial === social.name ? 0.9 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Glow effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${social.gradient} opacity-0 blur-md -z-10`}
                    animate={{
                      opacity: hoveredSocial === social.name ? 0.5 : 0,
                      scale: hoveredSocial === social.name ? 1.3 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Tooltip */}
                  <motion.span
                    className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs font-medium rounded-lg whitespace-nowrap border border-white/20 backdrop-blur-md shadow-xl"
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
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-white/20" aria-hidden="true" />
                  </motion.span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-black/30 to-black/20 hover:from-accent-cyan/20 hover:to-purple-500/20 border-2 border-white/10 hover:border-accent-cyan/50 rounded-xl text-secondary hover:text-white transition-all duration-300 overflow-hidden backdrop-blur-sm w-full justify-center"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="font-semibold relative z-10">Back to Top</span>
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative z-10"
          >
            <ArrowUp size={18} />
          </motion.div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, 'contact');
