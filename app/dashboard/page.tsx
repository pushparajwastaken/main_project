import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userSheetProgressModel from "@/model/userSheetProgress.model";
import SheetModel from "@/model/sheet.model";
import {
  BookOpen,
  CheckCircle,
  Clock,
  BarChart3,
  Trophy,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Dashboard — PlacedIn",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");

  await dbConnect();

  const progressListRaw = await userSheetProgressModel
    .find({ userId: session.user._id })
    .lean();

  const sheetIds = progressListRaw.map((p) => (p as any).sheetId);
  const sheetsRaw = await SheetModel.find({ _id: { $in: sheetIds } }).lean();

  const sheetsMap: Record<string, any> = {};
  for (const s of sheetsRaw) {
    sheetsMap[(s as any)._id.toString()] = s;
  }

  const enrollments: any[] = progressListRaw.map((p: any) => ({
    ...JSON.parse(JSON.stringify(p)),
    sheet: JSON.parse(JSON.stringify(sheetsMap[p.sheetId.toString()] ?? null)),
  }));

  // Summary stats
  const totalEnrolled = enrollments.length;
  const completedSheets = enrollments.filter((e) => e.progressPercent === 100).length;
  const totalTopicsDone = enrollments.reduce((sum, e) => sum + (e.completedTopics ?? 0), 0);
  const totalTopics = enrollments.reduce((sum, e) => sum + (e.totalTopics ?? 0), 0);
  const overallPct = totalTopics
    ? Math.round((totalTopicsDone / totalTopics) * 100)
    : 0;

  // Sort: in-progress first, then completed, then not started
  enrollments.sort((a, b) => {
    const aActive = a.progressPercent > 0 && a.progressPercent < 100 ? 0 : a.progressPercent === 100 ? 1 : 2;
    const bActive = b.progressPercent > 0 && b.progressPercent < 100 ? 0 : b.progressPercent === 100 ? 1 : 2;
    return aActive - bActive;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Welcome */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {session.user.username ?? session.user.name ?? "there"}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Keep the momentum going. Here&apos;s your progress across all enrolled sheets.
          </p>
        </div>
        <Link
          href="/sheets"
          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shrink-0"
        >
          <BookOpen size={14} /> Browse sheets
        </Link>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Sheets enrolled",
            value: totalEnrolled,
            icon: BookOpen,
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-950/40",
          },
          {
            label: "Topics completed",
            value: totalTopicsDone,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50 dark:bg-green-950/40",
          },
          {
            label: "Overall progress",
            value: `${overallPct}%`,
            icon: BarChart3,
            color: "text-violet-600",
            bg: "bg-violet-50 dark:bg-violet-950/40",
          },
          {
            label: "Sheets completed",
            value: completedSheets,
            icon: Trophy,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-950/40",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border p-4 bg-card">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={16} className={stat.color} />
            </div>
            <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Enrolled sheets */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Sheets</h2>
        {totalEnrolled > 0 && (
          <span className="text-sm text-muted-foreground">{totalEnrolled} enrolled</span>
        )}
      </div>

      {enrollments.length === 0 ? (
        <div className="rounded-xl border border-border p-16 text-center">
          <BookOpen size={40} className="text-muted-foreground/25 mx-auto mb-4" />
          <p className="font-semibold mb-2">No sheets enrolled yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Browse our curated sheets and click &quot;Enroll&quot; to start tracking your progress.
          </p>
          <Link
            href="/sheets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse sheets <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((e) => {
            const pct: number = e.progressPercent ?? 0;
            const isComplete = pct === 100;
            const notStarted = pct === 0;

            return (
              <Link
                key={e._id}
                href={`/sheets/${e.sheet?.slug}`}
                className="group block rounded-xl border border-border p-5 hover:border-indigo-500/50 hover:shadow-sm transition-all bg-card"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold group-hover:text-indigo-600 transition-colors truncate">
                        {e.sheet?.title ?? "Unknown Sheet"}
                      </h3>
                      {isComplete && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          <CheckCircle size={10} /> Done
                        </span>
                      )}
                      {notStarted && !isComplete && (
                        <span className="shrink-0 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          Not started
                        </span>
                      )}
                    </div>
                    {e.sheet?.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {e.sheet.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold">{pct}%</div>
                    <div className="text-xs text-muted-foreground">
                      {e.completedTopics ?? 0}/{e.totalTopics ?? 0} topics
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isComplete ? "bg-green-500" : "bg-indigo-600"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    {isComplete ? (
                      <span className="text-green-600 font-medium">Completed!</span>
                    ) : (
                      <span>{100 - pct}% remaining</span>
                    )}
                    {e.lastActivity && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(e.lastActivity).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Continue <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
