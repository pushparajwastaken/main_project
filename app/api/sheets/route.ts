import UserModel from "@/model/user.model";
import SheetModel from "@/model/sheet.model";
import dbConnect from "@/lib/dbConnect";
import { success } from "zod";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const sheets = await SheetModel.find({});
    if (!sheets) {
      return Response.json(
        { success: false, message: "Sheets not found" },
        {
          status: 404,
        },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Sheets fetched Successfully",
        data: sheets,
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    console.error("Error fetching the sheets", err);
    return Response.json(
      { success: false, message: err.message },
      {
        status: 400,
      },
    );
  }
}
