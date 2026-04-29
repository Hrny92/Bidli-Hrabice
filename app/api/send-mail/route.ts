import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// .env.local:
// SMTP_HOST=smtp.seznam.cz
// SMTP_PORT=465
// SMTP_USER=info@hrncirovistudio.cz
// SMTP_PASS=heslo
// SMTP_FROM=info@hrncirovistudio.cz
// MAIL_TO=lukas.hrncir@bidli.cz

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true, // port 465 = SSL (ne STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

/** Ochrana před XSS v HTML emailu */
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHtml(name: string, phone: string, email: string, message: string): string {
  const now = new Date().toLocaleString('cs-CZ', {
    timeZone: 'Europe/Prague',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Nová poptávka – Bidli v Hrabicích</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <!-- HEADER -->
    <tr>
      <td style="background:#142f4c;border-radius:20px 20px 0 0;padding:40px 48px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <p style="margin:0 0 4px;color:#ef8625;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Nová poptávka z webu</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;line-height:1.2;">Bidli v&nbsp;Hrabicích</h1>
              <p style="margin:6px 0 0;color:#8aa8c4;font-size:13px;">hrabice.bidli.cz</p>
            </td>
            <td align="right" style="vertical-align:top;">
              <span style="background:#ef8625;border-radius:50px;padding:8px 18px;color:#fff;font-size:12px;font-weight:700;white-space:nowrap;">📩 Formulář</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ACCENT LINE -->
    <tr><td style="background:linear-gradient(90deg,#ef8625,#f5a952);height:4px;"></td></tr>

    <!-- BODY -->
    <tr>
      <td style="background:#ffffff;padding:40px 48px;">

        <p style="margin:0 0 28px;color:#4b5563;font-size:15px;line-height:1.6;">
          Někdo vyplnil kontaktní formulář na webu <strong>hrabice.bidli.cz</strong>. Níže najdeš všechny zadané údaje.
        </p>

        <!-- KONTAKTNÍ ÚDAJE -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td colspan="2" style="padding-bottom:12px;border-bottom:2px solid #f3f4f6;">
              <p style="margin:0;color:#142f4c;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Kontaktní údaje</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 0 0;width:130px;vertical-align:top;">
              <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Jméno</p>
            </td>
            <td style="padding:16px 0 0;vertical-align:top;">
              <p style="margin:0;color:#111827;font-size:16px;font-weight:700;">${esc(name)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0 0;vertical-align:top;">
              <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Telefon</p>
            </td>
            <td style="padding:12px 0 0;vertical-align:top;">
              <a href="tel:${esc(phone)}" style="color:#ef8625;font-size:16px;font-weight:700;text-decoration:none;">${esc(phone)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0 0;vertical-align:top;">
              <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">E-mail</p>
            </td>
            <td style="padding:12px 0 0;vertical-align:top;">
              <a href="mailto:${esc(email)}" style="color:#ef8625;font-size:15px;font-weight:600;text-decoration:none;">${esc(email)}</a>
            </td>
          </tr>
        </table>

        <!-- ZPRÁVA -->
        ${message.trim() ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr>
            <td style="padding-bottom:12px;border-bottom:2px solid #f3f4f6;">
              <p style="margin:0;color:#142f4c;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Zpráva</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0 0;">
              <div style="background:#f9fafb;border-left:4px solid #ef8625;border-radius:0 12px 12px 0;padding:20px 24px;">
                <p style="margin:0;color:#374151;font-size:15px;line-height:1.7;white-space:pre-wrap;">${esc(message)}</p>
              </div>
            </td>
          </tr>
        </table>
        ` : `<p style="color:#9ca3af;font-size:13px;font-style:italic;margin:0 0 32px;">(Žádná zpráva nebyla zadána)</p>`}

        <!-- CTA BUTTON -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <a href="mailto:${esc(email)}"
                 style="display:inline-block;background:#ef8625;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:50px;">
                Odpovědět na poptávku →
              </a>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#f9fafb;border-radius:0 0 20px 20px;padding:24px 48px;border-top:1px solid #e5e7eb;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                Odesláno <strong>${now}</strong> z formuláře na
                <a href="https://hrabice.bidli.cz" style="color:#ef8625;text-decoration:none;">hrabice.bidli.cz</a>
              </p>
            </td>
            <td align="right">
              <p style="margin:0;color:#d1d5db;font-size:11px;">BIDLI · Hrabice</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message } = await req.json()

    if (!name || !email || !phone) {
      return NextResponse.json(
        { status: 'error', message: 'Vyplňte všechna povinná pole.' },
        { status: 400 }
      )
    }

    await transporter.sendMail({
      from: `"Web Bidli v Hrabicích" <${process.env.SMTP_FROM}>`,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `Nová poptávka z webu – ${name}`,
      html: buildHtml(name, phone, email, message ?? ''),
    })

    return NextResponse.json({ status: 'success' })
  } catch (err) {
    console.error('Mail error:', err)
    return NextResponse.json(
      { status: 'error', message: 'Chyba při odesílání e-mailu.' },
      { status: 500 }
    )
  }
}
