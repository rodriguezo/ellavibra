const {Resend} = require('resend');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const safe = (s) => String(s).replace(/[<>]/g, '');
  const html = `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#2B1810">
    <h2 style="font-size:22px;font-weight:400;margin-bottom:4px">Nuevo mensaje desde ellavibra.com</h2>
    <p style="font-size:13px;color:#8A6E5A;margin-bottom:24px">Formulario de contacto</p>
    <table style="width:100%;font-size:14px;line-height:1.6;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#8A6E5A;width:90px">Nombre</td><td style="padding:8px 0"><strong>${safe(name)}</strong></td></tr>
      <tr><td style="padding:8px 0;color:#8A6E5A">Email</td><td style="padding:8px 0"><a href="mailto:${safe(email)}" style="color:#C46A3C">${safe(email)}</a></td></tr>
    </table>
    <hr style="border:none;border-top:0.5px solid #F5E6DA;margin:20px 0">
    <p style="font-size:13px;color:#8A6E5A;margin-bottom:8px">Mensaje</p>
    <p style="font-size:14px;line-height:1.7;white-space:pre-wrap">${safe(message)}</p>
  </div>`;

  try {
    await resend.emails.send({
      from: 'Ella Vibra <hola@ellavibra.com>',
      to: 'ellavibrateam@gmail.com',
      reply_to: email,
      subject: `Nuevo mensaje de ${name}`,
      html
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
