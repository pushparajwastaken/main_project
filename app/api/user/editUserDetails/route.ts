import UserModel from "@/model/user.model";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { profileSchema } from "@/schemas/profileSchema";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  try {
    await dbConnect();
    const body = await request.json();
    const result = profileSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 },
      );
    }
    const { college, gradYear, username } = result.data;
    const user = await UserModel.findById(session.user._id);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }
    let count = 0;
    if (username !== undefined && user.username !== username) {
      user.username = username;
      count++;
    }
    if (college !== undefined && user.college !== college) {
      user.college = college;
      count++;
    }
    if (gradYear !== undefined && user.gradYear !== gradYear) {
      user.gradYear = gradYear;
      count++;
    }
    if (count === 0) {
      return Response.json(
        { success: true, message: "User details remain same" },
        { status: 200 },
      );
    }
    await user.save();
    return Response.json(
      { success: true, message: "User details updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error editing user details", error);
    return Response.json(
      { success: false, message: "Error updating the user details" },
      { status: 500 },
    );
  }
}
