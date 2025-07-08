import dbConnect from "@/db/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";

interface MessageIdParams {
  params: Promise<{ messageId: string }>;
}

export async function DELETE(request: Request, { params }: MessageIdParams) {
  await dbConnect();
  try {
    const { messageId } = await params;

    if (!messageId) {
      throw new Error("Message ID is required");
    }

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 }
      );
    }
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Error occurred in delete message route while deleting message:-",
      error
    );
    return Response.json(
      { success: false, message: "Error while deleting message" },
      { status: 500 }
    );
  }
}
