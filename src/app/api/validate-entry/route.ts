import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Check required environment variables
    if (!process.env.ENTRY_PASSWORD || !process.env.ENTRY_TOKEN) {
      console.error("Missing required environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Parse request body
    const { password } = await req.json();

    // Validate password exists
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Check if password matches
    if (password === process.env.ENTRY_PASSWORD) {
      // Create response with success status
      const response = NextResponse.json({ success: true }, { status: 200 });

      // Set secure cookie with entry token
      response.cookies.set({
        name: "entry_token",
        value: process.env.ENTRY_TOKEN,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    // Password doesn't match
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    console.error("Error in validate-entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
