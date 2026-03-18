const {Resend} = require('resend');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { type, name, email, event_name } = req.body;

  let subject, html;

  if (type === 'waitlist') {
    subject = '¡Bienvenida a Ella Vibra!';
    html = `<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1e1a2e">
      <h1 style="font-size:32px;font-weight:300;margin-bottom:4px">Ella <em style="color:#7f77dd">Vibra</em></h1>
      <p style="font-size:15px;font-style:italic;color:#7a6e8a;margin-bottom:32px">Sanar. Crecer. Florecer juntas.</p>
      <p style="font-size:15px;line-height:1.7">Hola <strong>${name}</strong>,</p>
      <p style="font-size:15px;line-height:1.7;margin-top:16px">Gracias por unirte a nuestra comunidad. Estamos felices de tenerte aquí.</p>
      <p style="font-size:15px;line-height:1.7;margin-top:16px">Explora nuestros recursos, conoce los próximos eventos y siéntete en casa. Este es tu espacio.</p>
      <p style="font-size:15px;line-height:1.7;margin-top:16px">Únete a nuestra comunidad de WhatsApp para estar al día con todo lo que viene:</p>
      <p style="margin-top:12px"><a href="https://chat.whatsapp.com/CJ2bRYitCIdDmMsDC2OqXX?mode=hq2tcli" style="display:inline-block;background:#7f77dd;color:#fff;padding:12px 24px;border-radius:40px;text-decoration:none;font-family:sans-serif;font-size:14px;font-weight:500">Unirme al WhatsApp ✦</a></p>
      <p style="font-size:15px;line-height:1.7;margin-top:16px">Si tienes alguna pregunta, escríbenos a <a href="mailto:hola@ellavibra.com" style="color:#7f77dd">hola@ellavibra.com</a> — estamos aquí para ti.</p>
      <p style="font-size:15px;line-height:1.7;margin-top:24px">Con amor,<br><strong>Camila & el equipo de Ella Vibra</strong></p>
      <hr style="border:none;border-top:0.5px solid #e8e4f8;margin:32px 0">
      <a href="https://ellavibra.com" style="font-size:13px;color:#7f77dd;text-decoration:none">ellavibra.com</a>
    </div>`;
  } else if (type === 'rsvp') {
    subject = `¡Tu lugar está reservado! – ${event_name}`;
    html = `<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1e1a2e">
      <h1 style="font-size:32px;font-weight:300;margin-bottom:4px">Ella <em style="color:#7f77dd">Vibra</em></h1>
      <p style="font-size:15px;font-style:italic;color:#7a6e8a;margin-bottom:32px">Sanar. Crecer. Florecer juntas.</p>
      <p style="font-size:15px;line-height:1.7">Hola <strong>${name}</strong>,</p>
      <p style="font-size:15px;line-height:1.7;margin-top:16px">¡Tu lugar para <strong>${event_name}</strong> está confirmado! Pronto recibirás los detalles de acceso.</p>
      <p style="font-size:15px;line-height:1.7;margin-top:16px">Si tienes alguna pregunta, escríbenos a <a href="mailto:hola@ellavibra.com" style="color:#7f77dd">hola@ellavibra.com</a>.</p>
      <p style="font-size:15px;line-height:1.7;margin-top:24px">Con amor,<br><strong>Camila & el equipo de Ella Vibra</strong></p>
      <hr style="border:none;border-top:0.5px solid #e8e4f8;margin:32px 0">
      <a href="https://ellavibra.com" style="font-size:13px;color:#7f77dd;text-decoration:none">ellavibra.com</a>
    </div>`;
  }

  try {
    await resend.emails.send({
      from: 'Ella Vibra <hola@ellavibra.com>',
      to: email,
      subject,
      html
    });
    res.status(200).json({ok: true});
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
