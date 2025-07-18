import { DB_NAME } from "@/constant/dbName";
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}` || ""
    );
    
    connection.isConnected = db.connections[0].readyState;

    console.log("DB is connected successfully");
  } catch (error) {
    console.log("DB connection failed:-", error);

    process.exit(1);
  }
}

export default dbConnect;
