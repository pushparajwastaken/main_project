import questionModel from "@/model/question.model";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserTopicProgressModel from "@/model/userTopicProgress.model";
import userSheetProgressModel from "@/model/userSheetProgress.model";
import topicModel from "@/model/topic.model";
import { getServerSession } from "next-auth";
// we send two types of requests on this route
export async function POST({ params }: { params: { questionId: string } }) {
  //get session from the server
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
    //get the question Id from the parameters
    const questionId = params.questionId;
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
    //search for the question with the help of questionId
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
    //search for the topic with the help of the topicId in the question Model
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
    // search for a user with the userId from session and topicId from topic model
    const topicProgress = await UserTopicProgressModel.findOne({
      userId: session.user._id,
      topicId: topic._id,
    });
    //if user has already completed that question,i.e, the question exists in topic progress model then we return
    if (
      topicProgress?.completedQuestions.some((q) => q.toString() === questionId)
    ) {
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
    //find the user topic progress model and add the question id to it and update the lastActivity
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
    //find the total no of questions of that topic
    const totalQuestionsTopic = await questionModel.countDocuments({
      topicId: question.topicId,
    });
    //find the total completed questions from the userTopicProgress Model
    const completedCount = userTopicProgress?.completedQuestions.length ?? 0;
    //if completed questions ==totalQuestions update topicprogressmodel.isCompleted to true
    if (completedCount == totalQuestionsTopic) {
      await UserTopicProgressModel.findOneAndUpdate(
        { userId: session.user._id, topicId: question.topicId },
        { $set: { isCompleted: true, completedAt: new Date() } },
      );
    }
    // find user sheet progress
    const sheetProgress = await userSheetProgressModel.findOne({
      userId: session.user._id,
      sheetId: topic.sheetId,
    });
    //if sheet progress exists and the topic is completed update the total completed topics in user sheet
    if (sheetProgress && completedCount === totalQuestionsTopic) {
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
          $addToSet: {
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
//deleting a questionId
export async function DELETE({ params }: { params: { questionId: string } }) {
  //get session from the erver
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
    //extract questionid from parame
    const questionId = params.questionId;
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
    // find the question with the help of the question id
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
    //find the topic from the topic id
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
    //find the topic progress model and remove the questionid from completed questions
    const topicProgress = await UserTopicProgressModel.findOneAndUpdate(
      {
        userId: session.user._id,
        topicId: question.topicId,
      },
      {
        $pull: { completedQuestions: questionId },

        $set: {
          sheetId: topic.sheetId,
          subjectId: topic.subjectId,
          lastActivity: new Date(),
        },
      },
      { upsert: true, new: true },
    );
    //find total number of questions in topic and completed question
    const totalQuestionsTopic = await questionModel.countDocuments({
      topicId: question.topicId,
    });

    const completedCount = topicProgress?.completedQuestions.length ?? 0;
    //find user progress sheet
    const sheetProgress = await userSheetProgressModel.findOne({
      userId: session.user._id,
      sheetId: topic.sheetId,
    });
    //if shheet exists and the topic is marked completed and completedCount<totalQuestionsop
    if (
      sheetProgress &&
      topicProgress?.isCompleted &&
      completedCount < totalQuestionsTopic
    ) {
      const newCompleted = sheetProgress.completedTopics - 1;
      const newPercent = Math.round(
        (newCompleted / sheetProgress.totalTopics) * 100,
      );
      //remove the topic from the user sheet progress model
      await userSheetProgressModel.findOneAndUpdate(
        { userId: session.user._id, sheetId: topic.sheetId },
        {
          $set: {
            completedTopics: newCompleted,
            progressPercent: newPercent,
            lastActivity: new Date(),
          },
          $pull: {
            completedTopicIds: topic._id,
          },
        },
      );
      //turn usertopicprogress to isCompleted False
      await UserTopicProgressModel.findOneAndUpdate(
        { userId: session.user._id, topicId: question.topicId },
        {
          $set: { isCompleted: false },
        },
      );
    }

    return Response.json(
      { success: true, message: "Question marked as Incomplete" },
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
