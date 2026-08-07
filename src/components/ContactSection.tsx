import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  User,
  Mail,
  Tag,
  Clock,
  Zap,
  X
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Process Automation',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Automatically hide form 3.5 seconds after successful submission greeting
  useEffect(() => {
    if (submittedMessage) {
      const timer = setTimeout(() => {
        setShowForm(false);
        setSubmittedMessage(null);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [submittedMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmittedMessage(null);
    setErrorMessage(null);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '98039fb8-4525-4f44-968a-3912eb290b21';

    try {
      // 1. Primary submission via Web3Forms API using FormData
      const formPayload = new FormData();
      formPayload.append('access_key', accessKey);
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      formPayload.append('subject', formData.subject || 'Portfolio Contact');
      formPayload.append('message', formData.message);
      formPayload.append('from_name', formData.name);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formPayload,
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (pErr) {
        console.warn('Failed to parse Web3Forms JSON response:', pErr);
      }

      if (response.ok && data && data.success) {
        setSubmittedMessage(`Thank you ${formData.name}! Your message regarding "${formData.subject}" has been sent successfully.`);
        setFormData({ name: '', email: '', subject: 'Process Automation', message: '' });
        return;
      }

      // 2. Fallback to /api/contact endpoint if Web3Forms direct call failed
      console.warn('Web3Forms direct submission returned non-success. Calling /api/contact fallback...');
      const apiRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let apiData: any = null;
      try {
        apiData = await apiRes.json();
      } catch (pErr) {
        console.warn('Failed to parse /api/contact JSON response:', pErr);
      }

      if (apiRes.ok && (apiData?.success || apiData?.message)) {
        setSubmittedMessage(apiData.message || `Thank you ${formData.name}! Your message has been sent successfully.`);
        setFormData({ name: '', email: '', subject: 'Process Automation', message: '' });
      } else {
        setErrorMessage(data?.message || apiData?.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission network error:', err);
      // Final attempt to hit local /api/contact
      try {
        const apiRes = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const apiData = await apiRes.json();
        if (apiRes.ok && (apiData?.success || apiData?.message)) {
          setSubmittedMessage(apiData.message || `Thank you ${formData.name}! Your message has been sent successfully.`);
          setFormData({ name: '', email: '', subject: 'Process Automation', message: '' });
          return;
        }
      } catch (fallbackErr) {
        console.error('Fallback /api/contact failed:', fallbackErr);
      }
      setErrorMessage('Network error while sending message. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden min-h-[750px] flex flex-col justify-center">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-10 w-full">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-widest shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect & Collaborate</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-white uppercase font-serif drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            GET IN TOUCH
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full shadow-[0_0_10px_#06b6d4]"></div>
        </div>

        {/* Dynamic Container Layout */}
        <div
          className={`transition-all duration-700 ease-in-out ${
            showForm
              ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch'
              : 'max-w-xl mx-auto flex flex-col items-center justify-center'
          }`}
        >
          {/* ================= ANIMATED CYBER GRAPHIC CARD ================= */}
          <div
            className={`w-full transition-all duration-700 ease-in-out ${
              showForm ? 'lg:col-span-5' : 'lg:col-span-12'
            } flex flex-col justify-between rounded-3xl bg-slate-900/60 border-2 border-cyan-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.15)] relative overflow-hidden group hover:border-cyan-400/60`}
          >
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

            {/* Glowing Scanline Animation overlay */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-scanline pointer-events-none"></div>

            <div className="space-y-6 relative z-10 text-center">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ONLINE & READY FOR NEW PROJECTS</span>
              </div>

              {/* Title & Copy */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider leading-tight">
                  LET&apos;S BUILD SOMETHING <span className="bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent">EXTRAORDINARY</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {!showForm
                    ? 'Interested in process automation, Power BI dashboards, SQL engineering, or full-time roles? Click the Connect button below to get started!'
                    : 'Fill out your details on the right to send a direct message.'}
                </p>
              </div>

              {/* Central Interactive Animation Container */}
              <div className="relative py-6 sm:py-10 flex flex-col items-center justify-center">
                {/* Outer Spinning Ring */}
                <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border-2 border-dashed border-cyan-500/40 animate-spin-slow flex items-center justify-center relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#06b6d4]"></div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-300 shadow-[0_0_10px_#14b8a6]"></div>
                </div>

                {/* Inner Pulsing Ring */}
                <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-cyan-400/50 bg-cyan-950/30 animate-pulse-ring flex items-center justify-center"></div>

                {/* CENTER INTERACTIVE CONNECT BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowForm(!showForm)}
                  className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:shadow-[0_0_45px_rgba(6,182,212,0.9)] flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group/btn"
                  title={showForm ? 'Hide Form' : 'Click to Connect with me'}
                >
                  <Zap className="w-8 h-8 sm:w-9 sm:h-9 text-cyan-300 animate-bounce group-hover/btn:text-cyan-200" />
                  <span className="text-[11px] font-black text-cyan-200 mt-1 uppercase tracking-widest group-hover/btn:text-white">
                    {showForm ? 'CONNECTED' : 'CONNECT'}
                  </span>
                  <span className="text-[9px] font-medium text-cyan-400/80">
                    {showForm ? 'Click to close' : 'Click center'}
                  </span>
                </button>

                <div className="absolute -bottom-1 right-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-teal-500/40 text-slate-200 text-[11px] font-bold shadow-[0_0_15px_rgba(20,184,166,0.2)] flex items-center gap-1.5 animate-float-reverse pointer-events-none">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Fast Response</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE: CONTACT FORM (SLIDES IN ON CONNECT CLICK) ================= */}
          {showForm && (
            <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border-2 border-cyan-500/40 p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col justify-center animate-slideInRight relative">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 border border-cyan-500/30 text-slate-400 hover:text-white hover:border-cyan-400 transition-all shadow-md cursor-pointer"
                title="Close Form"
              >
                <X className="w-5 h-5" />
              </button>

              {submittedMessage ? (
                <div className="p-8 sm:p-12 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 text-center space-y-5 animate-fadeIn shadow-[0_0_30px_rgba(6,182,212,0.3)] relative overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-cyan-400 text-slate-950 mx-auto flex items-center justify-center shadow-[0_0_25px_#06b6d4]">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider">Message Delivered!</h3>
                  <p className="text-sm text-cyan-200 max-w-md mx-auto">{submittedMessage}</p>
                  <p className="text-xs text-cyan-400/80 font-medium">Closing and returning automatically...</p>
                  
                  {/* Auto-close animated progress bar */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-4">
                    <div className="bg-gradient-to-r from-cyan-400 to-teal-300 h-full w-full animate-[shrink_3.5s_linear_forwards]"></div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1 border-b border-cyan-500/20 pb-4 pr-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-cyan-400" />
                      <span>Send a Direct Message</span>
                    </h3>
                    <p className="text-xs text-slate-400">Fill out your information to start a conversation.</p>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200 font-semibold animate-fadeIn">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>Your Name <span className="text-cyan-400">*</span></span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-inner"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Your Email <span className="text-cyan-400">*</span></span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. sarah@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Subject Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Inquiry Subject</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all cursor-pointer shadow-inner"
                    >
                      <option value="Process Automation">Process Automation (n8n / Power Apps)</option>
                      <option value="Data Analytics">Data Analytics & Power BI Dashboards</option>
                      <option value="SQL Engineering">SQL Query Optimization / Database Management</option>
                      <option value="Full-Time / Contract Role">Full-Time / Contract Hiring Role</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message Details <span className="text-cyan-400">*</span></span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your automation project, analytical needs, or role opportunity..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none shadow-inner"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl text-xs sm:text-sm font-bold tracking-widest text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] active:scale-[0.98] flex items-center justify-center gap-2 uppercase cursor-pointer"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                        <span>SENDING MESSAGE...</span>
                      </span>
                    ) : (
                      <>
                        <span>SUBMIT MESSAGE</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


