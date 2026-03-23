import UserModel from "@/model/user.model";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
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
        status: 400,
      },
    );
  }
  await dbConnect();
  try {
    const { college, gradYear, username } = await request.json();
    const user = await UserModel.findById(session.user._id);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }
    let count = 0;
    if (user.username != username) {
      user.username = username;
      count++;
    }
    if (user.college != college) {
      user.college = college;
      count++;
    }
    if (user.gradYear != gradYear) {
      user.gradYear = gradYear;
      count++;
    }
    if (count == 0) {
      return Response.json(
        {
          success: true,
          message: "User details remain same",
        },
        { status: 400 },
      );
    }
    await user.save();
    return Response.json(
      {
        success: true,
        message: "User details updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error editing user details", error);
    return Response.json(
      {
        success: false,
        message: "Error updating the user details",
      },
      {
        status: 400,
      },
    );
  }
}
