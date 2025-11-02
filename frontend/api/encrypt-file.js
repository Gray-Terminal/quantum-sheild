export default async function handler(req, res) {
  const target = 'https://quantum-sheild-production.up.railway.app/encrypt-file';

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: { 'content-type': req.headers['content-type'] || '' },
      body: req.method === 'POST' ? req.body : undefined,
    });

    // forward status + headers
    res.status(upstream.status);
    upstream.headers.forEach((v, k) => res.setHeader(k, v));
    const data = await upstream.arrayBuffer();
    res.send(Buffer.from(data));
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy request failed' });
  }
}
