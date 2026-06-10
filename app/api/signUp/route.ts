import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/schemas/signUpSchema";
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 },
      );
    }
    const { username, email, password, college, gradYear } = result.data;

    const existingUserByUsername = await UserModel.findOne({ username });
    if (existingUserByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      return Response.json(
        { success: false, message: "User already exists with this email" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      emailVerified: true,
      college,
      gradYear,
    });
    await newUser.save();

    return Response.json(
      { success: true, message: "User registered successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering User", error);
    return Response.json(
      { success: false, message: "Error registering User" },
      { status: 500 },
    );
  }
}
