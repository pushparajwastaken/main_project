import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import SheetModel from "@/model/sheet.model";
import SubjectModel from "@/model/subject.model";
import topicModel from "@/model/topic.model";
import questionModel from "@/model/question.model";
import userSheetProgressModel from "@/model/userSheetProgress.model";
import UserTopicProgressModel from "@/model/userTopicProgress.model";
import SheetContent from "./SheetContent";
import { Lock, Users, BookOpen } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await dbConnect();
  const sheet = await SheetModel.findOne({ slug, isPublished: true }).lean();
  if (!sheet) return { title: "Sheet not found" };
  return {
    title: `${(sheet as any).title} — PlacedIn`,
    description: (sheet as any).description ?? "",
  };
}

export default async function SheetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await dbConnect();

  const sheetRaw = await SheetModel.findOne({ slug, isPublished: true }).lean();
  if (!sheetRaw) notFound();
  const sheet: any = JSON.parse(JSON.stringify(sheetRaw));

  // Fetch subjects, topics, questions
  const subjectsRaw = await SubjectModel.find({ sheetId: sheet._id })
    .sort({ order: 1 })
    .lean();
  const subjects: any[] = JSON.parse(JSON.stringify(subjectsRaw));

  const topicsRaw = await topicModel
    .find({ sheetId: sheet._id })
    .sort({ subjectId: 1, order: 1 })
    .lean();
  const topics: any[] = JSON.parse(JSON.stringify(topicsRaw));

  const topicIds = topicsRaw.map((t) => (t as any)._id);
  const questionsRaw = await questionModel
    .find({ topicId: { $in: topicIds } })
    .sort({ order: 1 })
    .lean();
  const questions: any[] = JSON.parse(JSON.stringify(questionsRaw));

  // Group topics by subject
  const topicsBySubject: Record<string, any[]> = {};
  for (const t of topics) {
    const key = t.subjectId;
    if (!topicsBySubject[key]) topicsBySubject[key] = [];
    topicsBySubject[key].push(t);
  }

  // Group questions by topic
  const questionsByTopic: Record<string, any[]> = {};
  for (const q of questions) {
    const key = q.topicId;
    if (!questionsByTopic[key]) questionsByTopic[key] = [];
    questionsByTopic[key].push(q);
  }

  // User session + progress
  const session = await getServerSession(authOptions);
  let isEnrolled = false;
  let completedQuestionIds: string[] = [];

  if (session?.user?._id) {
    const userProgress = await userSheetProgressModel
      .findOne({ userId: session.user._id, sheetId: sheet._id })
      .lean();

    if (userProgress) {
      isEnrolled = true;
      const topicProgressList = await UserTopicProgressModel.find({
        userId: session.user._id,
        sheetId: sheet._id,
      }).lean();
      completedQuestionIds = topicProgressList.flatMap((tp) =>
        (tp.completedQuestions as any[]).map((q) => q.toString())
      );
    }
  }

  const totalSubjects = subjects.length;
  const totalTopics = topics.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Sheet header */}
      <div className="mb-8">
        {/* Tags */}
        {sheet.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {(sheet.tags as string[]).map((tag: string) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"
              >
                {tag}
              </span>
            ))}
            {sheet.isPremium && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                <Lock size={10} /> Premium
              </span>
            )}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{sheet.title}</h1>
        {sheet.description && (
          <p className="text-muted-foreground leading-relaxed">{sheet.description}</p>
        )}

        {/* Quick stats */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} />
            {totalSubjects} subjects · {totalTopics} topics
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {questions.length} questions
          </span>
        </div>
      </div>

      {/* Interactive content */}
      <SheetContent
        sheetId={sheet._id}
        subjects={subjects}
        topicsBySubject={topicsBySubject}
        questionsByTopic={questionsByTopic}
        isEnrolled={isEnrolled}
        isLoggedIn={!!session}
        completedQuestionIds={completedQuestionIds}
        totalTopics={totalTopics}
      />
    </div>
  );
}
