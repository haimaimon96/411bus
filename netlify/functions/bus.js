exports.handler = async function(event) {
  const params = event.queryStringParameters || {};
  const stop = params.stop || '5407';
  const gtfs = params.gtfs || '11045';
  const nowSec = Math.floor(Date.now() / 1000);
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  try {
    const bnUrl = `https://api.busnearby.co.il/directions/index/stops/1:${gtfs}/stoptimes?numberOfDepartures=4&timeRange=14400&startTime=${nowSec}&locale=he`;
    const r = await fetch(bnUrl);
    if (r.ok) {
      const data = await r.json();
      return { statusCode: 200, headers, body: JSON.stringify({ source: 'busnearby', data }) };
    }
  } catch (e) {}

  try {
    const cbUrl = `https://curlbus.app/${stop}`;
    const r2 = await fetch(cbUrl, { headers: { Accept: 'application/json' } });
    if (r2.ok) {
      const data = await r2.json();
      return { statusCode: 200, headers, body: JSON.stringify({ source: 'curlbus', data }) };
    }
  } catch (e) {}

  return { statusCode: 502, headers, body: JSON.stringify({ error: 'Upstream unavailable' }) };
};
