import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import UserModel from "@/model/user.model";
import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { success } from "zod";
export async function POST(request: Request) {
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
  const { currentPassword, newPassword } = await request.json();
  const user = await UserModel.findById(session.user._id).select("+password");
  if (!user) {
    return Response.json({
      success: false,
    });
  }
  const isPasswordSame = await bcryptjs.compare(user.password, currentPassword);
  if (!isPasswordSame) {
    return Response.json(
      {
        success: false,
        message: "Passwords do not match",
      },
      {
        status: 403,
      },
    );
  }
  const newHashedPassword = await bcryptjs.hash(newPassword, 10);
  user.password = newHashedPassword;
  await user.save();
  return Response.json(
    { success: true, message: "Password changed successfully" },
    { status: 200 },
  );
  try {
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
