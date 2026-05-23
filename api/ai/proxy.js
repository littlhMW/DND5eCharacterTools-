<<<<<<< HEAD
// api/ai/proxy.js
export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { url, headers = {}, body } = req.body;

    if (!url) {
      return res.status(400).json({ error: { message: 'Missing target URL' } });
    }

    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: { message: data?.error?.message || `Upstream error: ${upstream.status}` },
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || 'Internal proxy error' },
    });
  }
}
=======
// api/ai/proxy.js
export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { url, headers = {}, body } = req.body;

    if (!url) {
      return res.status(400).json({ error: { message: 'Missing target URL' } });
    }

    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: { message: data?.error?.message || `Upstream error: ${upstream.status}` },
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || 'Internal proxy error' },
    });
  }
}
>>>>>>> 6f3e64015c5af541141000658f866a9340d07c7a
