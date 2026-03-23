import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import UserModel from "@/model/user.model";
import { flightRouterStateSchema } from "next/dist/server/app-render/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      {
        sucess: false,
        message: "Unauthorized",
      },
      {
        status: 400,
      },
    );
  }
  try {
    await dbConnect();
    const user = await UserModel.findById(session.user._id);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "User fetched successfully",
        data: user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error finding user info", error);
    return Response.json(
      {
        success: false,
        message: "Unable to fetch user info",
      },
      {
        status: 400,
      },
    );
  }
}
