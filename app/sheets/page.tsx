import Link from "next/link";
import { BookOpen, Lock, ArrowRight } from "lucide-react";
import dbConnect from "@/lib/dbConnect";
import SheetModel from "@/model/sheet.model";

const tagColors: Record<string, string> = {
  dsa: "bg-blue-50 text-blue-700 border-blue-200",
  oop: "bg-purple-50 text-purple-700 border-purple-200",
  dbms: "bg-green-50 text-green-700 border-green-200",
  os: "bg-orange-50 text-orange-700 border-orange-200",
  cn: "bg-cyan-50 text-cyan-700 border-cyan-200",
  system: "bg-red-50 text-red-700 border-red-200",
};

function tagClass(tag: string) {
  const key = tag.toLowerCase();
  return tagColors[key] ?? "bg-gray-50 text-gray-600 border-gray-200";
}

export default async function SheetsPage() {
  await dbConnect();
  const raw = await SheetModel.find({ isPublished: true }).sort({ order: 1 }).lean();
  const sheets: any[] = JSON.parse(JSON.stringify(raw));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Study Sheets</h1>
        <p className="text-muted-foreground">
          Curated preparation sheets for every topic that matters in technical interviews.
        </p>
      </div>

      {sheets.length === 0 ? (
        <div className="rounded-xl border border-border p-20 text-center">
          <BookOpen size={40} className="text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-medium mb-1">No sheets published yet</p>
          <p className="text-sm text-muted-foreground">Check back soon — we&apos;re adding sheets regularly.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sheets.map((sheet) => (
            <Link
              key={sheet._id}
              href={`/sheets/${sheet.slug}`}
              className="group flex flex-col rounded-xl border border-border p-6 bg-card hover:border-indigo-500/60 hover:shadow-md transition-all"
            >
              {/* Icon + premium badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shrink-0">
                  <BookOpen size={18} className="text-indigo-600" />
                </div>
                {sheet.isPremium && (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    <Lock size={10} /> Premium
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-semibold text-base mb-1.5 group-hover:text-indigo-600 transition-colors">
                {sheet.title}
              </h2>

              {/* Description */}
              {sheet.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {sheet.description}
                </p>
              )}

              {/* Footer: topics + tags */}
              <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {sheet.totalTopics ?? 0} topics
                </span>
                {sheet.tags?.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {(sheet.tags as string[]).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-0.5 rounded-full border ${tagClass(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA hint */}
              <div className="mt-3 flex items-center gap-1 text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Start learning <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
