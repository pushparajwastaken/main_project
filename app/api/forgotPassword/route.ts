import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { sendResetEmail } from "@/helpers/sendResetEmail";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { randomBytes } from "crypto";
export async function GET(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 },
      );
    }
    const { email } = result.data;
    const User = await UserModel.findOne({ email });
    if (!User) {
      return Response.json(
        {
          success: false,
          message: "User doesn't exist",
        },
        { status: 404 },
      );
    }
    const resetPasswordToken = randomBytes(32).toString("hex");
    const resetPasswordExpiry = new Date();
    resetPasswordExpiry.setHours(Date.now() + 3600000);
    User.resetPasswordToken = resetPasswordToken;
    User.resetPasswordExpiry = resetPasswordExpiry;
    await User.save();
    const username = User.username;
    const emailResponse = await sendResetEmail(
      email,
      username,
      resetPasswordToken,
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Reset Password Email sent successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error sending Reset Password Link", error);
    return Response.json(
      {
        success: false,
        message: "Error sending Reset Password Link",
      },
      {
        status: 500,
      },
    );
  }
}
