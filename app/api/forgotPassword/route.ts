import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { sendResetEmail } from "@/helpers/sendResetEmail";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { randomBytes } from "crypto";
export async function POST(request: Request) {
  await dbConnect();
  try {
    //get the information from the request
    const body = await request.json();
    //validate the password
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 },
      );
    }
    //get email from the result of validation
    const { email } = result.data;
    //search for the user with email
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
    //create a new resetPasswordToken and its expiry
    const resetPasswordToken = randomBytes(32).toString("hex");
    const resetPasswordExpiry = new Date();
    //set its expiry to 1 hour later
    resetPasswordExpiry.setHours(resetPasswordExpiry.getHours() + 1);
    User.resetPasswordToken = resetPasswordToken;
    User.resetPasswordExpiry = resetPasswordExpiry;
    await User.save();
    const username = User.username;
    //send the resetpassword email
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
