import dbConnect from "@/lib/dbConnect";
import topicModel from "@/model/topic.model";
import SheetModel from "@/model/sheet.model";
import userSheetProgressModel from "@/model/userSheetProgress.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
export async function POST(
  request: Request,
  { params }: { params: { sheetId: string } },
) {
  //get the user
  const session = await getServerSession(authOptions);
  if (!session?.user) {
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
  try {
    await dbConnect();
    //get sheetId from params
    const { sheetId } = params;
    if (!sheetId) {
      return Response.json(
        {
          success: false,
          message: "No sheetId found",
        },
        {
          status: 404,
        },
      );
    }
    //get the sheet with the help of sheetID
    const sheet = await SheetModel.findById(sheetId);
    if (!sheet) {
      return Response.json(
        { success: false, message: "No sheet found" },
        {
          status: 400,
        },
      );
    }
    //check if the user already exists
    const existingUserSheetProgress = await userSheetProgressModel.findOne({
      userId: session.user._id,
      sheetId,
    });
    if (existingUserSheetProgress) {
      return Response.json(
        {
          success: false,
          message: "Already enrolled",
        },
        {
          status: 200,
        },
      );
    }
    //search for total topics in the sheet
    const totalTopics = await topicModel.countDocuments({ sheetId });
    await userSheetProgressModel.create({
      userId: session.user._id,
      sheetId,
      enrolledAt: new Date(),
      totalTopics,
      completedTopics: 0,
      progressPercent: 0,
      subjectProgress: [],
    });
    return Response.json(
      {
        success: true,
        message: "Enrolled successfully in the sheet",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error enrolling to the sheet", error);
    return Response.json(
      {
        success: false,
        message: "Error enrolling to the audience",
      },
      {
        status: 400,
      },
    );
  }
}
