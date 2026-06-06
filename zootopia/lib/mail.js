import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Potwierdź swój adres e-mail",
    html: `
      <h2>Potwierdzenie rejestracji</h2>
      <p>Kliknij link, aby potwierdzić adres e-mail:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  });
}

export async function sendEmailChangeVerificationEmail(email, token) {
  const verificationUrl = `${process.env.APP_URL}/api/profile/verify-email-change?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Potwierdź zmianę adresu e-mail",
    html: `
      <h2>Potwierdzenie zmiany adresu e-mail</h2>
      <p>Kliknij link, aby potwierdzić nowy adres e-mail:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  });
}