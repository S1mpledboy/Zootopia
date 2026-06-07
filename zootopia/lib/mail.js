import nodemailer from "nodemailer";

const mailUser = process.env.GMAIL_USER;
const mailPassword = process.env.GMAIL_APP_PASSWORD;
const defaultFromEmail = process.env.MAIL_FROM || `Zootopia <${mailUser}>`;

function getTransporter() {
  if (!mailUser || !mailPassword) {
    throw new Error("Brak konfiguracji poczty: ustaw GMAIL_USER i GMAIL_APP_PASSWORD w .env.local.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailUser,
      pass: mailPassword,
    },
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(Number(value) || 0);
}

async function sendMail({ to, subject, html }) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: defaultFromEmail,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

  await sendMail({
    to: email,
    subject: "Potwierdz swoj adres e-mail",
    html: `
      <h2>Potwierdzenie rejestracji</h2>
      <p>Kliknij link, aby potwierdzic adres e-mail:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  });
}

export async function sendEmailChangeVerificationEmail(email, token) {
  const verificationUrl = `${process.env.APP_URL}/api/profile/verify-email-change?token=${token}`;

  await sendMail({
    to: email,
    subject: "Potwierdz zmiane adresu e-mail",
    html: `
      <h2>Potwierdzenie zmiany adresu e-mail</h2>
      <p>Kliknij link, aby potwierdzic nowy adres e-mail:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  });
}

export async function sendOrderConfirmationEmail(order) {
  const email = order?.deliveryAddress?.email;

  if (!email) {
    throw new Error("Brak adresu e-mail do wyslania potwierdzenia zamowienia.");
  }

  const itemsRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>
      `
    )
    .join("");

  const address = order.deliveryAddress;

  await sendMail({
    to: email,
    subject: `Potwierdzenie zamowienia ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin-bottom: 8px;">Dziekujemy za zlozenie zamowienia!</h2>
        <p>Twoje zamowienie <strong>${escapeHtml(order.orderNumber)}</strong> zostalo przyjete do realizacji.</p>

        <h3 style="margin-top: 24px;">Szczegoly zamowienia</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px 0; border-bottom: 2px solid #111827; text-align: left;">Produkt</th>
              <th style="padding: 10px 0; border-bottom: 2px solid #111827; text-align: center;">Ilosc</th>
              <th style="padding: 10px 0; border-bottom: 2px solid #111827; text-align: right;">Kwota</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>

        <p style="font-size: 18px; margin-top: 18px;">
          <strong>Razem: ${formatCurrency(order.totalAmount)}</strong>
        </p>

        <h3 style="margin-top: 24px;">Dostawa i platnosc</h3>
        <p>
          Metoda dostawy: <strong>${escapeHtml(order.shippingMethod)}</strong><br />
          Metoda platnosci: <strong>${escapeHtml(order.paymentMethod)}</strong>
        </p>

        <h3 style="margin-top: 24px;">Adres dostawy</h3>
        <p>
          ${escapeHtml(address.firstName)} ${escapeHtml(address.lastName)}<br />
          ${escapeHtml(address.street)}<br />
          ${escapeHtml(address.postalCode)} ${escapeHtml(address.city)}<br />
          ${escapeHtml(address.country)}
        </p>

        <p style="margin-top: 28px;">Pozdrawiamy,<br />Zootopia</p>
      </div>
    `,
  });
}