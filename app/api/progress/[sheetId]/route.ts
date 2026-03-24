import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userSheetProgressModel from "@/model/userSheetProgress.model";
import UserTopicProgressModel from "@/model/userTopicProgress.model";
import questionModel from "@/model/question.model";
export async function GET(
  request: Request,
  { params }: { params: { sheetId: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();

    const sheetId = params.sheetId;

    if (!sheetId) {
      return Response.json(
        { success: false, message: "Sheet ID is required" },
        { status: 400 },
      );
    }

    const userSheet = await userSheetProgressModel.findOne({
      userId: session.user._id,
      sheetId,
    });

    if (!userSheet) {
      return Response.json(
        { success: false, message: "Not enrolled in this sheet" },
        { status: 404 },
      );
    }

    const topics = await UserTopicProgressModel.find({
      userId: session.user._id,
      sheetId,
    });

    const topicIds = topics.map((t) => t.topicId);

    const questionCounts = await questionModel.aggregate([
      { $match: { topicId: { $in: topicIds } } },
      {
        $group: {
          _id: "$topicId",
          total: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map();
    questionCounts.forEach((q) => {
      countMap.set(q._id.toString(), q.total);
    });

    const formattedTopics = topics.map((t) => {
      const totalQuestions = countMap.get(t.topicId.toString()) || 0;
      const completed = t.completedQuestions.length;

      return {
        topicId: t.topicId,
        completedQuestions: completed,
        totalQuestions,
        isCompleted: completed === totalQuestions,
      };
    });

    return Response.json(
      {
        success: true,
        data: {
          sheetId,
          progressPercent: userSheet.progressPercent,
          completedTopics: userSheet.completedTopics,
          totalTopics: userSheet.totalTopics,
          topics: formattedTopics,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting the sheet", error);

    return Response.json(
      { success: false, message: "Error getting the sheet" },
      { status: 500 },
    );
  }
}
