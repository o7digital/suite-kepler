// Fixed connection to this hotel's validated CRM agenda. No credentials or draft data.
export const config = { maxDuration: 15 };
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  try {
    const response = await fetch('https://api-suitesmine-production.up.railway.app/api/public/website-agendas/dd9de887-264c-478c-b562-fca15b913b31/current', {
      headers: { Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Agenda unavailable');
    const data = await response.json();
    if (data.siteKey !== 'kepler' || !/^20\d{2}-(0[1-9]|1[0-2])$/.test(data.monthKey) || !Array.isArray(data.events) || typeof data.available !== 'boolean') throw new Error('Invalid agenda');
    return res.status(200).json({ monthKey: data.monthKey, available: data.available, events: data.available ? data.events : [] });
  } catch { return res.status(503).json({ error: 'Agenda temporarily unavailable' }); }
}
