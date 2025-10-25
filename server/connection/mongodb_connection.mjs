import mongoose from "mongoose";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console()],
});


export async function connectDB() {
  try {
    await mongoose.connect("mongodb://admin:password@localhost:27017/dev_db?authSource=admin");
    logger.info("Connected to MongoDB successfully");
  } catch (error) {
    logger.error("MongoDB connection error", { error });
    throw error;
  }
}
