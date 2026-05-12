import { sendVerificationEmail } from "@/lib/mail";

export async function GET() {
  await sendVerificationEmail("test@gmail.com", "test-token-123");

  return Response.json({
    message: "Test email sent",
  });
}