import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
  await dbConnect();
  try {
    //get the request and then validate it with resetPassword schema
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 },
      );
    }
    //get a  token and password for verification
    const { token, password } = result.data;
    const user = await UserModel.findOne({
      resetPasswordToken: token,
    });
    if (!user) {
      return Response.json(
        { success: false, message: "Invalid or expired reset link" },
        { status: 400 },
      );
    }
    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      return Response.json(
        {
          success: false,
          message: "Reset link has expired, please request a new one",
        },
        { status: 400 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return Response.json(
      { success: true, message: "Password reset successfully, please login" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error reseting the Password", error);
    return Response.json(
      {
        success: false,
        message: "Error reseting the password",
      },
      {
        status: 400,
      },
    );
  }
}
