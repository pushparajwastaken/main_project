"use client";

import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  CheckCircle,
  Circle,
  Lock,
  PlayCircle,
  FileText,
  BookOpen,
  StickyNote,
} from "lucide-react";

const typeIcons = {
  problem: BookOpen,
  article: FileText,
  video: PlayCircle,
  note: StickyNote,
} as const;

const difficultyBadge: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

interface Subject {
  _id: string;
  title: string;
  order: number;
}
interface Topic {
  _id: string;
  subjectId: string;
  title: string;
  difficulty?: string;
}
interface Question {
  _id: string;
  topicId: string;
  title: string;
  url: string;
  type: string;
  difficulty?: string;
  platform?: string;
  isPremium: boolean;
}

interface Props {
  sheetId: string;
  subjects: Subject[];
  topicsBySubject: Record<string, Topic[]>;
  questionsByTopic: Record<string, Question[]>;
  isEnrolled: boolean;
  isLoggedIn: boolean;
  completedQuestionIds: string[];
  totalTopics: number;
}

export default function SheetContent({
  sheetId,
  subjects,
  topicsBySubject,
  questionsByTopic,
  isEnrolled: initialEnrolled,
  isLoggedIn,
  completedQuestionIds: initialCompleted,
  totalTopics,
}: Props) {
  const [isEnrolled, setIsEnrolled] = useState(initialEnrolled);
  const [enrolling, setEnrolling] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(initialCompleted)
  );
  const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set());
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Set<string>>(new Set());

  const allQuestions = Object.values(questionsByTopic).flat();
  const completedCount = allQuestions.filter((q) => completedIds.has(q._id)).length;
  const totalQuestions = allQuestions.length;
  const pct = totalQuestions ? Math.round((completedCount / totalQuestions) * 100) : 0;

  async function enroll() {
    if (!isLoggedIn) {
      window.location.href = `/signIn?callbackUrl=/sheets/${sheetId}`;
      return;
    }
    setEnrolling(true);
    try {
      const res = await fetch(`/api/progress/enroll/${sheetId}`, {
        method: "POST",
      });
      if (res.ok) setIsEnrolled(true);
    } finally {
      setEnrolling(false);
    }
  }

  async function toggleQuestion(questionId: string) {
    if (!isEnrolled || pending.has(questionId)) return;
    const isDone = completedIds.has(questionId);

    setPending((p) => new Set(p).add(questionId));
    setCompletedIds((prev) => {
      const next = new Set(prev);
      isDone ? next.delete(questionId) : next.add(questionId);
      return next;
    });

    try {
      await fetch(`/api/progress/topics/questions/${questionId}`, {
        method: isDone ? "DELETE" : "POST",
      });
    } catch {
      // revert on error
      setCompletedIds((prev) => {
        const next = new Set(prev);
        isDone ? next.add(questionId) : next.delete(questionId);
        return next;
      });
    } finally {
      setPending((p) => {
        const next = new Set(p);
        next.delete(questionId);
        return next;
      });
    }
  }

  function toggleSubject(id: string) {
    setOpenSubjects((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleTopic(id: string) {
    setOpenTopics((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div>
      {/* Enroll / Progress card */}
      <div className="mb-6 p-5 rounded-xl border border-border bg-card">
        {isEnrolled ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Your progress</span>
              <span className="text-muted-foreground">
                {completedCount} / {totalQuestions} questions
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{pct}% complete</span>
              {pct === 100 && (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle size={12} /> Sheet completed!
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-medium text-sm">Start tracking your progress</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enroll to mark questions complete and track progress across this sheet.
              </p>
            </div>
            <button
              onClick={enroll}
              disabled={enrolling}
              className="shrink-0 px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {enrolling ? "Enrolling…" : isLoggedIn ? "Enroll" : "Sign in to enroll"}
            </button>
          </div>
        )}
      </div>

      {/* Subject accordion */}
      <div className="space-y-3">
        {subjects.map((subject, idx) => {
          const topics = topicsBySubject[subject._id] ?? [];
          const subjectQs = topics.flatMap((t) => questionsByTopic[t._id] ?? []);
          const subjectDone = subjectQs.filter((q) => completedIds.has(q._id)).length;
          const isOpen = openSubjects.has(subject._id);

          return (
            <div key={subject._id} className="rounded-xl border border-border overflow-hidden">
              {/* Subject row */}
              <button
                onClick={() => toggleSubject(subject._id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <span className="font-semibold">{subject.title}</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    ({topics.length} topics)
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {isEnrolled && subjectQs.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {subjectDone}/{subjectQs.length}
                    </span>
                  )}
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Topics */}
              {isOpen && (
                <div className="border-t border-border divide-y divide-border/60">
                  {topics.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-muted-foreground">No topics yet.</p>
                  ) : (
                    topics.map((topic) => {
                      const topicQs = questionsByTopic[topic._id] ?? [];
                      const topicDone = topicQs.filter((q) => completedIds.has(q._id)).length;
                      const topicComplete =
                        topicQs.length > 0 && topicDone === topicQs.length;
                      const isTopicOpen = openTopics.has(topic._id);

                      return (
                        <div key={topic._id}>
                          {/* Topic row */}
                          <button
                            onClick={() => toggleTopic(topic._id)}
                            className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-muted/25 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              {isEnrolled ? (
                                topicComplete ? (
                                  <CheckCircle
                                    size={14}
                                    className="text-green-500 shrink-0"
                                  />
                                ) : (
                                  <Circle
                                    size={14}
                                    className="text-muted-foreground/50 shrink-0"
                                  />
                                )
                              ) : (
                                <Circle
                                  size={14}
                                  className="text-muted-foreground/30 shrink-0"
                                />
                              )}
                              <span className="text-sm font-medium">{topic.title}</span>
                              {topic.difficulty && (
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                    difficultyBadge[topic.difficulty] ??
                                    "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {topic.difficulty}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-muted-foreground shrink-0">
                              {isEnrolled && topicQs.length > 0 && (
                                <span>
                                  {topicDone}/{topicQs.length}
                                </span>
                              )}
                              <span className="hidden sm:inline">
                                {topicQs.length} questions
                              </span>
                              <ChevronDown
                                size={13}
                                className={`transition-transform duration-200 ${
                                  isTopicOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </button>

                          {/* Questions */}
                          {isTopicOpen && topicQs.length > 0 && (
                            <div className="bg-muted/10 divide-y divide-border/40">
                              {topicQs.map((q) => {
                                const Icon =
                                  typeIcons[q.type as keyof typeof typeIcons] ?? BookOpen;
                                const done = completedIds.has(q._id);
                                const isPending = pending.has(q._id);

                                return (
                                  <div
                                    key={q._id}
                                    className={`flex items-center gap-3 px-8 py-2.5 ${
                                      done ? "opacity-55" : ""
                                    }`}
                                  >
                                    {/* Checkbox / icon */}
                                    {isEnrolled ? (
                                      <button
                                        onClick={() => toggleQuestion(q._id)}
                                        disabled={isPending}
                                        className="shrink-0 disabled:opacity-50"
                                        title={done ? "Mark incomplete" : "Mark complete"}
                                      >
                                        {done ? (
                                          <CheckCircle
                                            size={14}
                                            className="text-green-500"
                                          />
                                        ) : (
                                          <Circle
                                            size={14}
                                            className="text-muted-foreground hover:text-indigo-600 transition-colors"
                                          />
                                        )}
                                      </button>
                                    ) : (
                                      <Icon
                                        size={14}
                                        className="text-muted-foreground/50 shrink-0"
                                      />
                                    )}

                                    {/* Question link */}
                                    <a
                                      href={q.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`text-sm flex-1 min-w-0 hover:text-indigo-600 transition-colors flex items-center gap-1.5 ${
                                        done ? "line-through" : ""
                                      }`}
                                    >
                                      <span className="truncate">{q.title}</span>
                                      <ExternalLink
                                        size={11}
                                        className="shrink-0 opacity-40"
                                      />
                                    </a>

                                    {/* Metadata chips */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {q.difficulty && (
                                        <span
                                          className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                            difficultyBadge[q.difficulty] ?? ""
                                          }`}
                                        >
                                          {q.difficulty}
                                        </span>
                                      )}
                                      {q.platform && (
                                        <span className="text-xs text-muted-foreground hidden sm:inline">
                                          {q.platform}
                                        </span>
                                      )}
                                      {q.isPremium && (
                                        <Lock size={11} className="text-amber-500" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <div className="rounded-xl border border-border p-16 text-center text-muted-foreground">
          <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Content is being added to this sheet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
