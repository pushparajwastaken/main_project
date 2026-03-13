import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/email-template";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "PlacedIn:Verification Code",
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });
    console.log("Resend data:", data);
    console.log("Resend error:", error);
    return { success: true, message: "Verification Email sent successfully" };
  } catch (error: unknown) {
    console.error("Error sending verification Email", error);
    return { success: false, message: (error as Error).message };
  }
}
