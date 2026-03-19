require("dotenv").config({ path: ".env.local" });
console.log("ENV:", process.env.MONGODB_URI);
import mongoose from "mongoose";
import data from "./dsa-sheet.json";

import SheetModel from "../model/sheet.model";
import SubjectModel from "../model/subject.model";
import topicModel from "../model/topic.model";
import questionModel from "../model/question.model";
import dbConnect from "../lib/dbConnect";

async function cleanup() {
  console.log("🧹 Cleaning up existing data...");
  await questionModel.deleteMany({});
  await topicModel.deleteMany({});
  await SubjectModel.deleteMany({});
  await SheetModel.deleteMany({});
  console.log("✅ Cleanup done");
}

async function seed() {
  await dbConnect();

  const sheet = await SheetModel.create({
    title: data.title,
    slug: data.slug,
    description: data.description,
    isPremium: data.isPremium,
    isPublished: true,
    totalTopics: 0,
  });
  console.log(`📄 Created sheet: ${sheet.title}`);

  let sheetTotalTopics = 0;

  for (const subjectData of data.subjects) {
    const subject = await SubjectModel.create({
      title: subjectData.title,
      slug: subjectData.slug,
      sheetId: sheet._id,
      order: subjectData.order,
      totalTopics: subjectData.topics.length,
    });
    console.log(`  📁 Created subject: ${subject.title}`);

    for (const topicData of subjectData.topics) {
      const topic = await topicModel.create({
        title: topicData.title,
        subjectId: subject._id,
        sheetId: sheet._id,
        order: topicData.order,
        difficulty: topicData.difficulty,
        totalQuestions: topicData.questions.length,
      });
      console.log(`    📝 Created topic: ${topic.title}`);

      await questionModel.insertMany(
        topicData.questions.map((q) => ({
          title: q.title,
          url: q.url,
          difficulty: q.difficulty,
          platform: q.platform,
          order: q.order,
          topicId: topic._id,
          type: "problem",
          isPremium: false,
        })),
      );
      console.log(`✅ Inserted ${topicData.questions.length} questions`);

      sheetTotalTopics++;
    }
  }

  await SheetModel.findByIdAndUpdate(sheet._id, {
    totalTopics: sheetTotalTopics,
  });

  console.log(`\n🎉 Seed complete!`);
  console.log(`   Sheet: ${sheet.title}`);
  console.log(`   Subjects: ${data.subjects.length}`);
  console.log(`   Total Topics: ${sheetTotalTopics}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
