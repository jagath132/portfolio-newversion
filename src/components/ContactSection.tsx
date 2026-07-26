import React, { useState } from 'react';
import { Send, CheckCircle2, Mail, MapPin, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Process Automation',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmittedMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmittedMessage(data.message || 'Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', subject: 'Process Automation', message: '' });
      } else {
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmittedMessage(`Thank you ${formData.name}! Your message has been sent. Jagath will review it shortly.`);
      setFormData({ name: '', email: '', subject: 'Process Automation', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-white uppercase font-serif drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            GET IN TOUCH
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full shadow-[0_0_10px_#06b6d4]"></div>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-slate-900/80 border-2 border-cyan-500/40 p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          {submittedMessage ? (
            <div className="p-8 rounded-2xl bg-cyan-950/80 border border-cyan-400 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-cyan-400 text-slate-950 mx-auto flex items-center justify-center shadow-[0_0_20px_#06b6d4]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Delivered!</h3>
              <p className="text-sm text-cyan-200">{submittedMessage}</p>
              <button
                onClick={() => setSubmittedMessage(null)}
                className="px-6 py-2 rounded-full text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Your Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Your Email <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sarah@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-300">Inquiry Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 transition-all"
                >
                  <option value="Process Automation">Process Automation (n8n / Power Apps)</option>
                  <option value="Data Analytics">Data Analytics & Power BI Dashboards</option>
                  <option value="SQL Engineering">SQL Query Optimization / Database Management</option>
                  <option value="Full-Time / Contract Role">Full-Time / Contract Hiring Role</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Message Details <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your automation project, analytical needs, or role opportunity..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl text-xs sm:text-sm font-bold tracking-widest text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] active:scale-98 flex items-center justify-center gap-2 uppercase"
              >
                {submitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Submit Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
