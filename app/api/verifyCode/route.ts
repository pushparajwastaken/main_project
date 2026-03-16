import { z } from "zod";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POSY(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Username not found",
        },
        { status: 404 },
      );
    }
    const isCodeValid = user.verifyToken === code;
    const isCodeNotExpired = new Date(user.verifyTokenExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.emailVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User is verified!",
        },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification Code is expired",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification Code",
        },
        { status: 401 },
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying User",
      },
      { status: 500 },
    );
  }
}
