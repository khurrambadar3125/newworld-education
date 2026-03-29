/**
 * /api/detect-country — Returns country based on request IP
 * Uses Vercel's built-in geo headers (free, no external API).
 */
export default function handler(req, res) {
  // Vercel provides geo data automatically via headers
  const country = req.headers['x-vercel-ip-country'] || '';
  const city = req.headers['x-vercel-ip-city'] || '';

  let detected = 'OTHER';
  if (country === 'PK') detected = 'PK';
  else if (country === 'AE') detected = 'UAE';
  else if (country === 'SA') detected = 'UAE'; // Saudi shares Gulf context
  else if (country === 'QA' || country === 'BH' || country === 'KW' || country === 'OM') detected = 'UAE'; // Gulf states

  res.status(200).json({ country: detected, raw: country, city });
}
