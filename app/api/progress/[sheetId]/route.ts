import userSheetProgressModel from "@/model/userSheetProgress.model";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

import dbConnect from "@/lib/dbConnect";

export async function GET(
  request: Request,
  { params }: { params: { sheetId: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }
  try {
    await dbConnect();
    const sheetId = params.sheetId;
    if (!sheetId) {
      return Response.json(
        {
          success: false,
          message: "No sheet id found",
        },
        {
          status: 404,
        },
      );
    }
    const userSheet = await userSheetProgressModel.findOne({
      userId: session.user._id,
      sheetId: params.sheetId,
    });

    if (!userSheet) {
      return Response.json(
        {
          success: false,
          message: "Not enrolled in this sheet",
        },
        {
          status: 404,
        },
      );
    }
    return Response.json(
      {
        success: true,
        data: userSheet,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error getting the sheet", error);
    return Response.json(
      {
        success: false,
        message: "Error getting the sheet",
      },
      {
        status: 400,
      },
    );
  }
}
