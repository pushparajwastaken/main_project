import { z } from "zod";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import dbConnect from "@/lib/dbConnect";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  //TODO-Use this in all other routes
  if (request.method !== "GET") {
    return Response.json(
      {
        success: false,
        message: "Method not allowoed",
      },
      { status: 405 },
    );
  }
  await dbConnect();
  try {
    //get paramters from url and then search for parameter named username
    const { searchParams } = new URL(request.url);
    const queryParama = {
      username: searchParams.get("username"),
    };
    //validate with Zod
    const result = usernameQuerySchema.safeParse(queryParama);

    if (!result.success) {
      const usernameErrors = result.error.issues
        .filter((i) => i.path.includes("username"))
        .map((i) => i.message);
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid Query Parameters",
        },
        {
          status: 400,
        },
      );
    }
    //get username after validation
    const { username } = result.data;
    //search for existing username who is also verified
    const existingVerifiedUser = await UserModel.findOne({
      username,
      emailVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is unqiue",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      },
    );
  }
}
