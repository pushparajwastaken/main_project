import mongoose from "mongoose";
import { setServers } from "dns";

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

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // System DNS can't resolve Atlas SRV records — force Google DNS before connecting.
    setServers(["8.8.8.8", "8.8.4.4"]);

    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    const db = await cached.promise;
    cached.conn = db.connections[0];
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("[dbConnect] connection failed:", error);
    throw error;
  }
}

export default dbConnect;
