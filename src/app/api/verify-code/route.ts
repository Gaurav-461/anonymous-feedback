import dbConnect from "@/db/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    // Decodes the URL-encoded username string to handle special characters that were encoded during transmission
    // This is necessary because when usernames containing special characters are sent via URLs, 
    // they get encoded (e.g., spaces become %20, @ becomes %40). This function converts them back to their original form
    // Example: 'john%20doe' becomes 'john doe', 'user%40example' becomes 'user@example'
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpiry = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpiry && isCodeValid) {
      (user.isVerified = true), await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired, please sign-up again to get a new code.",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.log("Error while verifying user:-", error.message);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
