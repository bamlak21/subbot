import mongoose from "mongoose";
import { config } from "./index";

export async function ConnectDB() {
  try {
    if (mongoose.connection.readyState === 1) return; //Already connected
    await mongoose.connect(config.mongoURI).then(() => {
      console.log("✅ MongoDB connected successfully!");
    });
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
}
