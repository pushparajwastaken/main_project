import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/email-template";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "PlacedIn:Verification Code",
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });
    return { success: true, message: "Verification Email sent successfully" };
  } catch (error: unknown) {
    console.error("Error sending verification Email", (error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}
