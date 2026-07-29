import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

interface ExtendedRequest extends IncomingMessage {
  body?: any;
  query?: Record<string, string>;
}

interface ExtendedResponse extends ServerResponse {
  status: (statusCode: number) => ExtendedResponse;
  json: (data: any) => void;
}

export default async function handler(req: ExtendedRequest, res: ExtendedResponse) {
  if (!res.status) {
    res.status = (statusCode: number) => {
      res.statusCode = statusCode;
      return res;
    };
  }
  if (!res.json) {
    res.json = (data: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization;
  const expectedPasscode = process.env.ADMIN_PASSCODE || 'admin';
  const token = authHeader ? authHeader.split(' ')[1] : null;

  if (req.method === 'GET') {
    if (authHeader && expectedPasscode && token !== expectedPasscode) {
      return res.status(401).json({ error: 'Unauthorized: Invalid passcode' });
    }

    let data = { personalInfo: {}, educationData: [], skillsCategories: [], experienceData: [], projectsData: [] };
    const dataFile = path.join(process.cwd(), 'data', 'portfolio.json');
    try {
      if (fs.existsSync(dataFile)) {
        const raw = fs.readFileSync(dataFile, 'utf-8');
        data = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading portfolio data file:', err);
    }
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    if (expectedPasscode) {
      if (!token || token !== expectedPasscode) {
        return res.status(401).json({ error: 'Unauthorized: Invalid passcode' });
      }
    }

    let bodyData = req.body;
    if (!bodyData) {
      try {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(chunk as Buffer);
        }
        const dataStr = Buffer.concat(buffers).toString();
        if (dataStr) {
          bodyData = JSON.parse(dataStr);
        }
      } catch (e) {
        console.error('Error parsing POST body:', e);
      }
    }

    return res.status(200).json({ success: true, message: 'Portfolio data updated successfully', data: bodyData });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
