import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyJwt } from "../../../../utils/lib/authHelper";

export async function GET() {
  try {
    const token = cookies().get("secure_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No secure token found" },
        { status: 401 }
      );
    }
    const payload = await verifyJwt(token);
    return NextResponse.json({
      user: {
        id: payload.id,
        role: payload.role,
        name: payload.name,
        image: payload.image,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
export async function POST() {
  try {
    const token = cookies().get("secure_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No secure token found" },
        { status: 401 }
      );
    }
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
