export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { stop = '5407', gtfs = '11045' } = req.query || {};
  const nowSec = Math.floor(Date.now() / 1000);

  try {
    const bnUrl = `https://api.busnearby.co.il/directions/index/stops/1:${gtfs}/stoptimes?numberOfDepartures=4&timeRange=14400&startTime=${nowSec}&locale=he`;
    const r = await fetch(bnUrl);
    if (r.ok) {
      const data = await r.json();
      return res.status(200).json({ source: 'busnearby', data });
    }
  } catch (e) {}

  try {
    const cbUrl = `https://curlbus.app/${stop}`;
    const r2 = await fetch(cbUrl, { headers: { Accept: 'application/json' } });
    if (r2.ok) {
      const data = await r2.json();
      return res.status(200).json({ source: 'curlbus', data });
    }
  } catch (e) {}

  return res.status(502).json({ error: 'Upstream unavailable' });
}
