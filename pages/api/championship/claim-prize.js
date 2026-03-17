/**
 * /api/championship/claim-prize
 * GET ?token=X: validate claim token
 * POST: submit address for prize delivery
 */
import { Redis } from '@upstash/redis';
import { notify } from '../../../utils/notify';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

const PK_CITIES = ['Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta','Sialkot','Gujranwala','Hyderabad','Bahawalpur','Sargodha','Abbottabad','Mardan','Sukkur','Larkana','Mirpur','Muzaffarabad','Gilgit','Skardu','Chitral','Swat','Other'];
const COURIERS = { Karachi:'TCS Express', Lahore:'TCS Express', Islamabad:'Leopards', Rawalpindi:'Leopards', Faisalabad:'TCS Express', Multan:'Call Courier', Peshawar:'TCS Express', Quetta:'Pakistan Post (EMS)', Other:'Pakistan Post (EMS)' };

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'token required' });
    const data = await kv.get(`championship:claimtoken:${token}`);
    if (!data) return res.status(404).json({ error: 'Token expired or invalid' });
    const claim = typeof data === 'string' ? JSON.parse(data) : data;
    return res.status(200).json({ valid: true, ...claim, cities: PK_CITIES });
  }

  if (req.method === 'POST') {
    const { token, fullName, address, city, landmark, phone } = req.body;
    if (!token || !fullName || !address || !city || !phone) return res.status(400).json({ error: 'All fields required' });

    // Validate
    if (address.length < 20) return res.status(400).json({ error: 'Address must be at least 20 characters with house/street number' });
    if (!/\d/.test(address)) return res.status(400).json({ error: 'Address must include a house or street number' });
    const phoneClean = phone.replace(/[\s\-()]/g, '');
    if (!/^(03\d{9}|\+923\d{9})$/.test(phoneClean)) return res.status(400).json({ error: 'Enter a valid Pakistani phone number (03xx-xxxxxxx)' });

    const tokenData = await kv.get(`championship:claimtoken:${token}`);
    if (!tokenData) return res.status(404).json({ error: 'Token expired' });
    const claim = typeof tokenData === 'string' ? JSON.parse(tokenData) : tokenData;

    // Save claim
    const claimData = { fullName, address, city, landmark, phone: phoneClean, prize: claim.prize, season: claim.season, submittedAt: new Date().toISOString() };
    await kv.set(`championship:claim:${claim.email}`, JSON.stringify(claimData));
    await kv.del(`championship:claimtoken:${token}`);

    const courier = COURIERS[city] || COURIERS.Other;

    // Notify Khurram via email AND WhatsApp
    const shipMsg = `🏆 SHIP PRIZE NOW\n\nPrize: ${claim.prize}\nSeason: ${claim.season}\n\nName: ${fullName}\nAddress: ${address}\nCity: ${city}\nLandmark: ${landmark || 'N/A'}\nPhone: ${phoneClean}\n\nRecommended courier: ${courier}\n\nMark as shipped at: newworld.education/admin/championship`;

    await notify({
      to: 'khurrambadar@gmail.com',
      phone: '+923262266682',
      subject: `🏆 SHIP NOW — ${fullName} — ${city} — ${claim.prize}`,
      title: 'Prize Ready to Ship',
      body: shipMsg.replace(/\n/g, '<br>'),
      whatsappText: shipMsg,
    });

    // Confirm to winner
    await notify({
      to: claim.email,
      subject: '📦 We have your address! Prize ships soon.',
      title: 'Address Received!',
      body: `We have received your delivery details. Your <strong>${claim.prize}</strong> will be shipped within 7-14 business days via <strong>${courier}</strong>.<br><br>You will receive a shipping confirmation email when it's on its way.`,
    });

    // Audit
    await kv.lpush(`championship:audit:${claim.email}`, JSON.stringify({
      event: 'address_submitted', timestamp: new Date().toISOString(), details: { city, courier },
    }));

    return res.status(200).json({ ok: true, courier });
  }

  return res.status(405).end();
}
