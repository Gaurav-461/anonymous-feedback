import dbConnect from "@/db/dbConnect";
import UserModel from "@/model/User";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const users = await UserModel.find({ isVerified: true }).limit(10).select(["_id", "username"]);
    return Response.json(
      { success: true, users, message: "All users fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error fetching users", error },
      { status: 500 }
    );
  }
}
