import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI =
  "mongodb+srv://psinghparmar42_db_user:vXvRseDoV9gg7XRp@cluster0.f5tguhj.mongodb.net/test?appName=Cluster0";

const sheetSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true, lowercase: true },
    description: String,
    isPremium: { type: Boolean, default: false },
    tags: [String],
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    totalTopics: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Sheet = mongoose.models.Sheet || mongoose.model("Sheet", sheetSchema);

const sheets = [
  {
    title: "Object Oriented Programming",
    slug: "oop",
    description:
      "Master OOP concepts — classes, inheritance, polymorphism, abstraction, and encapsulation with real interview questions.",
    tags: ["oop"],
    order: 1,
    totalTopics: 8,
    isPublished: true,
  },
  {
    title: "Database Management Systems",
    slug: "dbms",
    description:
      "SQL, normalization, transactions, indexing, and everything you need to ace DBMS rounds.",
    tags: ["dbms"],
    order: 2,
    totalTopics: 10,
    isPublished: true,
  },
  {
    title: "Operating Systems",
    slug: "os",
    description:
      "Process management, memory management, deadlocks, scheduling algorithms — all in one place.",
    tags: ["os"],
    order: 3,
    totalTopics: 9,
    isPublished: true,
  },
  {
    title: "Computer Networks",
    slug: "cn",
    description:
      "OSI model, TCP/IP, HTTP, DNS, sockets, and networking protocols for technical interviews.",
    tags: ["cn"],
    order: 4,
    totalTopics: 7,
    isPublished: true,
  },
  {
    title: "System Design",
    slug: "system-design",
    description:
      "Scalability, load balancing, caching, databases, and how to design large-scale distributed systems.",
    tags: ["system"],
    order: 5,
    totalTopics: 12,
    isPublished: true,
  },
  {
    title: "Data Structures & Algorithms",
    slug: "dsa",
    description:
      "Arrays, linked lists, trees, graphs, dynamic programming — curated top interview problems.",
    tags: ["dsa"],
    order: 6,
    totalTopics: 15,
    isPublished: true,
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("Connected. Seeding sheets...\n");

  for (const sheet of sheets) {
    const result = await Sheet.updateOne(
      { slug: sheet.slug },
      { $set: sheet },
      { upsert: true }
    );
    const action = result.upsertedCount ? "inserted" : "updated";
    console.log(`  [${action}] ${sheet.title}`);
  }

  console.log("\nDone. Closing connection.");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
