import questionModel from "@/model/question.model";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserTopicProgressModel from "@/model/userTopicProgress.model";
import userSheetProgressModel from "@/model/userSheetProgress.model";
import topicModel from "@/model/topic.model";
import { getServerSession } from "next-auth";

export async function GET(
  request: Request,
  { params }: { params: { questionId: string } },
) {
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
  try {
    await dbConnect();
    const questionId = params;
    if (!questionId) {
      return Response.json(
        {
          success: false,
          message: "Question Id not found",
        },
        {
          status: 404,
        },
      );
    }
    const question = await questionModel.findById(questionId);
    if (!question) {
      return Response.json(
        {
          success: false,
          message: "Question not found",
        },
        {
          status: 404,
        },
      );
    }
    const topic = await topicModel.findById(question.topicId);
    if (!topic) {
      return Response.json(
        {
          success: false,
          message: "Topic not found",
        },
        {
          status: 404,
        },
      );
    }
    const topicProgress = await UserTopicProgressModel.findOne({
      userId: session.user._id,
      topicId: topic._id,
    });
    if (topicProgress?.completedQuestions.includes(question._id)) {
      return Response.json(
        {
          success: false,
          message: "Already completed",
        },
        {
          status: 403,
        },
      );
    }
    const userTopicProgress = await UserTopicProgressModel.findOneAndUpdate(
      {
        userId: session.user._id,
        topicId: question.topicId,
      },
      {
        $addToSet: { completedQuestions: questionId },

        $set: {
          sheetId: topic.sheetId,
          subjectId: topic.subjectId,
          lastActivity: new Date(),
        },
      },
      { upsert: true, new: true },
    );
    const totalQuestionsTopic = await questionModel.countDocuments({
      topicId: question.topicId,
    });
    const updatedTopicProgress = await UserTopicProgressModel.findOne({
      userId: session.user._id,
      topicId: question.topicId,
    });
    const completedCount = updatedTopicProgress?.completedQuestions.length ?? 0;
    if (completedCount == totalQuestionsTopic) {
      await UserTopicProgressModel.findOneAndUpdate(
        { userId: session.user._id, topicId: question.topicId },
        { $set: { isCompleted: true, completedAt: new Date() } },
      );
    }
    const sheetProgress = await userSheetProgressModel.findOne({
      userId: session.user._id,
      sheetId: topic.sheetId,
    });
    if (sheetProgress) {
      const newCompleted = sheetProgress.completedTopics + 1;

      const newPercent = Math.round(
        (newCompleted / sheetProgress.totalTopics) * 100,
      );

      await userSheetProgressModel.findOneAndUpdate(
        { userId: session.user._id, sheetId: topic.sheetId },
        {
          $set: {
            completedTopics: newCompleted,
            progressPercent: newPercent,
            lastActivity: new Date(),
          },
          $push: {
            completedTopicIds: topic._id,
          },
        },
      );
    }

    return Response.json(
      { success: true, message: "Question marked as complete" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating status", error);
    return Response.json(
      {
        success: false,
        message: "Error updating",
      },
      {
        status: 401,
      },
    );
  }
}
