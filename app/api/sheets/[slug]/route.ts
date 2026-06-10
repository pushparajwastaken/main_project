import SheetModel from "@/model/sheet.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();
    const { slug } = await params;
    if (!slug) {
      return Response.json(
        {
          success: false,
          message: "Slug not found",
        },
        {
          status: 404,
        },
      );
    }
    const sheet = await SheetModel.findOne({
      slug,
    });
    if (!sheet) {
      return Response.json(
        {
          success: false,
          message: "Sheet not found",
        },
        {
          status: 404,
        },
      );
    }
    return Response.json(
      {
        success: true,
        message: "Sheets found successfully",
        data: sheet,
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    console.error("Error fetching sheets", err);
    return Response.json(
      { success: false, message: "Error fetching the sheet" },
      { status: 500 },
    );
  }
}
