import dbConnect from "@/db/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    console.log({ username, email, password });

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already exist",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    console.log("Is user already exist by email:", existingUserByEmail);

    // Generate OTP
    const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString();

    // Check if user already exists by email if not then create new user
    if (existingUserByEmail) {
      /* check if user is verified by email or if not then update password and send new verification code 
      and set new password
      */
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User is already exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      // Generate Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate expiry date for verification code
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      // Create new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        message: [],
      });

      // Save new user
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    console.log("Email response:", emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
        VerificationEmail: emailResponse.message,
      },
      { status: 201 }
    );
  } catch (signUpError) {
    console.log(
      "Error occurred while registering user from backend:-",
      signUpError
    );
    return Response.json(
      {
        message: "Error registering user",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
