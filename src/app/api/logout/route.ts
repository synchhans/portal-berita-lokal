import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { deleteCookie } from "../../../../utils/lib/authHelper";

const cookiesToDelete = ["secure_token"];

export async function POST(req: NextRequest) {
  const token = req.cookies.get("secure_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "User is not logged in." },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ message: "Logout successful" });
  cookiesToDelete.forEach((name) => {
    deleteCookie(response, name);
  });

  response.headers.set("Clear-Site-Data", '"cookies"');
  console.log("User logged out successfully");
  return response;
}
