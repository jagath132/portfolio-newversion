import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const DATA_FILE = path.join(__dirname, 'data', 'portfolio.json');

  // Helper to read data
  async function readPortfolioData() {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        const dataDir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        const defaultData = { personalInfo: {}, educationData: [], skillsCategories: [], experienceData: [], projectsData: [] };
        await fs.promises.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
        return defaultData;
      }
      const rawData = await fs.promises.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Error reading portfolio data file:', error);
      throw error;
    }
  }

  // Helper to write data
  async function writePortfolioData(data: any) {
    try {
      const dataDir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing portfolio data file:', error);
      throw error;
    }
  }

  // API Route: Get Portfolio Data
  app.get('/api/portfolio', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const expectedPasscode = process.env.ADMIN_PASSCODE || 'admin';
      
      if (authHeader && expectedPasscode) {
        const token = authHeader.split(' ')[1];
        if (!token || token !== expectedPasscode) {
          res.status(401).json({ error: 'Unauthorized: Invalid passcode' });
          return;
        }
      }

      const data = await readPortfolioData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read portfolio data' });
    }
  });

  // API Route: Update Portfolio Data (passcode protected)
  app.post('/api/portfolio', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const expectedPasscode = process.env.ADMIN_PASSCODE || 'admin';
      
      if (expectedPasscode) {
        const token = authHeader && authHeader.split(' ')[1];
        if (!token || token !== expectedPasscode) {
          res.status(401).json({ error: 'Unauthorized: Invalid passcode' });
          return;
        }
      }

      const newData = req.body;
      if (!newData || typeof newData !== 'object') {
        res.status(400).json({ error: 'Invalid data format' });
        return;
      }

      await writePortfolioData(newData);
      res.json({ success: true, message: 'Portfolio data updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update portfolio data' });
    }
  });

  // API Route: Health Check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });



  // API Route: Contact Form Submission Handler
  app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required fields.' });
      return;
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.VITE_WEB3FORMS_ACCESS_KEY || '98039fb8-4525-4f44-968a-3912eb290b21';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          subject: subject || 'Portfolio Contact',
          message,
          from_name: name,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        res.json({
          success: true,
          message: `Thank you ${name}! Your message regarding "${subject || 'General Inquiry'}" has been received. Jagath will get back to you shortly.`,
        });
      } else {
        res.status(500).json({ error: data.message || 'Failed to send message via Web3Forms.' });
      }
    } catch (err) {
      console.error('Received contact submission (offline log):', { name, email, subject, message, timestamp: new Date().toISOString() });
      res.json({
        success: true,
        message: `Thank you ${name}! Your message regarding "${subject || 'General Inquiry'}" has been received. Jagath will get back to you shortly.`,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    // Custom Dev Server SPA Routing for Admin Panel
    app.get('/admin*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(process.cwd(), 'admin/index.html');
        const template = await fs.promises.readFile(templatePath, 'utf-8');
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });

    // Custom Dev Server SPA Routing for Main Portfolio
    app.get('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(process.cwd(), 'index.html');
        const template = await fs.promises.readFile(templatePath, 'utf-8');
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve admin statically first
    app.use('/admin', express.static(path.join(distPath, 'admin')));
    // Serve main assets statically
    app.use(express.static(distPath));
    
    // Admin SPA Fallback
    app.get('/admin*', (_req, res) => {
      res.sendFile(path.join(distPath, 'admin', 'index.html'));
    });

    // Main Portfolio Fallback
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
