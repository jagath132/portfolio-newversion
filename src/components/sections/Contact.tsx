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
      <div className="glass-card flex-[0.75] rounded-2xl p-8">
        <Header {...config.contact} />

        <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8" noValidate>
          {Object.keys(config.contact.form).map(input => {
            const { span, placeholder } =
              config.contact.form[input as keyof typeof config.contact.form];
            const Component = input === 'message' ? 'textarea' : 'input';

            return (
              <label key={input} className="flex flex-col">
                <span className="mb-4 font-medium text-white">
                  {span}
                  <span className="text-red-400 ml-1">*</span>
                </span>
                <Component
                  type={input === 'email' ? 'email' : 'text'}
                  name={input}
                  value={form[`${input}`]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`bg-white/5 placeholder:text-secondary rounded-lg border ${validationErrors[input] ? 'border-red-500' : 'border-white/10'
                    } px-6 py-4 font-medium text-white outline-none focus:border-accent-cyan transition-colors`}
                  {...(input === 'message' && { rows: 7 })}
                  required
                  aria-invalid={!!validationErrors[input]}
                  aria-describedby={validationErrors[input] ? `${input}-error` : undefined}
                />
                {validationErrors[input] && (
                  <span id={`${input}-error`} className="mt-2 text-sm text-red-400" role="alert">
                    {validationErrors[input]}
                  </span>
                )}
              </label>
            );
          })}
          <button
            type="submit"
            disabled={loading || !isOnline}
            className="bg-tertiary shadow-primary w-fit rounded-xl px-8 py-3 font-bold text-white shadow-md outline-none hover:bg-tertiary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={loading}
          >
            {loading ? 'Sending...' : !isOnline ? 'Offline' : 'Send'}
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
