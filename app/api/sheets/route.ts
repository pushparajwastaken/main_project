import SheetModel from "@/model/sheet.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const sheets = await SheetModel.find({});
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
      { success: false, message: "Error fetching the sheets" },
      { status: 500 },
    );
  }
}
