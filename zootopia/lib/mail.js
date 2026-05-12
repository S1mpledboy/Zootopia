import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
});
export async function sendEmailChangeVerificationEmail(email, token) {
  const verificationUrl = `${process.env.APP_URL}/api/profile/verify-email-change?token=${token}`;

  await transporter.sendMail({
    from: '"Zootopia" <no-reply@zootopia.local>',
    to: email,
    subject: "Potwierdź zmianę adresu e-mail",
    html: `
      <h2>Potwierdzenie zmiany adresu e-mail</h2>
      <p>Kliknij link, aby potwierdzić nowy adres e-mail:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>Link jest ważny przez 1 godzinę.</p>
    `,
  });
}

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: '"Zootopia" <no-reply@zootopia.local>',
    to: email,
    subject: "Potwierdź swój adres e-mail",
    html: `
      <h2>Potwierdzenie rejestracji</h2>
      <p>Kliknij link, aby potwierdzić adres e-mail:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  });
}