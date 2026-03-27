import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import UserModel from "@/model/user.model";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
export async function POST(request: Request) {
  //get session
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }
  await dbConnect();
  //get new password and current password
  const { currentPassword, newPassword } = await request.json();
  try {
    const user = await UserModel.findById(session.user._id).select("+password");
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }
    //check if the current password provided by the user is same as the password stored in the db
    const isPasswordSame = await bcryptjs.compare(
      user.password,
      currentPassword,
    );
    if (!isPasswordSame) {
      return Response.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        {
          status: 401,
        },
      );
    }
    //create a hash of the new password and then save it
    const newHashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();
    return Response.json(
      { success: true, message: "Password changed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error changing the password", error);
    return Response.json(
      {
        success: false,
        message: "Error changing the password",
      },
      {
        status: 500,
      },
    );
  }
}
