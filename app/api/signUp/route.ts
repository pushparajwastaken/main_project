import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { signUpSchema } from "@/schemas/signUpSchema";
export async function POST(request: Request) {
  await dbConnect();
  try {
    //get body from the request and then validate it with signup schema
    const body = await request.json();
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 },
      );
    }
    //extract the info after validation
    const { username, email, password, college, gradYear } = result.data;
    //check if the user with same username exists
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      emailVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }
    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    //create a verify code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    //check if user already exists with the same email
    if (existingUserByEmail) {
      if (existingUserByEmail.emailVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 },
        );
      } else {
        //if user exists but email not verified then update it's following info
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyToken = verifyCode;
        existingUserByEmail.verifyTokenExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
        const emailResponse = await sendVerificationEmail(
          email,
          existingUserByEmail.username,
          verifyCode,
        );
        if (!emailResponse.success) {
          return Response.json(
            { success: false, message: emailResponse.message },
            { status: 500 },
          );
        }
      }
    } else {
      //if user with email doesn't exist create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        emailVerified: false,
        verifyToken: verifyCode,
        verifyTokenExpiry: expiryDate,
        college,
        gradYear,
      });
      await newUser.save();

      //after saving send verification Email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode,
      );
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 },
        );
      }
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering User", error);
    return Response.json(
      {
        success: false,
        message: "Error registering User",
      },
      {
        status: 500,
      },
    );
  }
}
