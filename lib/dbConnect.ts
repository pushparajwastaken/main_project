import mongoose from "mongoose";
import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function dbConnect(): Promise<mongoose.Connection> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in .env");
  }
  const MONGODB_URI = process.env.MONGODB_URI;
  if (cached.conn) {
    console.log("Already connected to the database");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }

  try {
    const db = await cached.promise;
    cached.conn = db.connections[0];
    console.log("DB Connected Successfully");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("Database connection error:", error);
    throw error;
  }
}

export default dbConnect;
