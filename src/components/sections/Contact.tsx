import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

import { EarthCanvas } from '../canvas';
import { SectionWrapper } from '../../hoc';
import { slideIn } from '../../utils/motion';
import { config } from '../../constants/config';
import { Header } from '../atoms/Header';

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
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          Thank you! Your message has been sent successfully.
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          Something went wrong. Please try again.
        </motion.div>
      )}
      <motion.div
        variants={slideIn('left', 'tween', 0.2, 1)}
        className="bg-black-100 flex-[0.75] rounded-2xl p-8"
      >
        <Header useMotion={false} {...config.contact} />

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
                  className="bg-tertiary placeholder:text-secondary rounded-lg border-none px-6 py-4 font-medium text-white outline-none"
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
      </motion.div>

      <motion.div
        variants={slideIn('right', 'tween', 0.2, 1)}
        className="h-[350px] md:h-[550px] xl:h-auto xl:flex-1"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, 'contact');
