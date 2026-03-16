import { resend } from "@/lib/resend";
import ResetEmail from "@/emails/reset-password-template";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendResetEmail(
  email: string,
  username: string,
  resetPasswordToken: string,
): Promise<ApiResponse> {
  try {
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetPasswordToken}`;
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "PlacedIn: Reset Passsword Link",
      react: ResetEmail({ username: username, resetLink }),
    });
    console.log("Resend data:", data);
    console.log("Resend error:", error);
    return { success: true, message: "Reset Password Email sent successfully" };
  } catch (error: unknown) {
    console.error("Error sending Reset Password Email", error);
    return { success: false, message: (error as Error).message };
  }
}
