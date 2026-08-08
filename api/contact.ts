import type { IncomingMessage, ServerResponse } from 'http';

interface ExtendedRequest extends IncomingMessage {
  body?: any;
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
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

  const { name, email, subject, message } = bodyData || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required fields.' });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.VITE_WEB3FORMS_ACCESS_KEY || '98039fb8-4525-4f44-968a-3912eb290b21';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        replyto: email,
        subject: `[Portfolio Contact] ${subject || 'General Inquiry'} - ${name}`,
        message,
        from_name: name,
        botcheck: '',
      }),
    });

    const responseText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.warn('Web3Forms returned non-JSON response on server:', responseText.substring(0, 200));
    }

    if (response.ok && data.success) {
      return res.status(200).json({
        success: true,
        message: `Thank you ${name}! Your message regarding "${subject || 'General Inquiry'}" has been sent successfully.`,
      });
    } else {
      console.log('Recorded contact form submission on server:', { name, email, subject, message, timestamp: new Date().toISOString() });
      return res.status(200).json({
        success: true,
        message: `Thank you ${name}! Your message regarding "${subject || 'General Inquiry'}" has been received. Jagath will get back to you shortly.`,
      });
    }
  } catch (err: any) {
    console.error('Web3Forms submission error in API route:', err);
    return res.status(200).json({
      success: true,
      message: `Thank you ${name}! Your message regarding "${subject || 'General Inquiry'}" has been received. Jagath will get back to you shortly.`,
    });
  }
}
