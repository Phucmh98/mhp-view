// app/api/clerk-register/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();

    // Validate required fields
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    const result = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: [email], // Clerk expects an array
        password,
        username,
        first_name: username, // Often required by Clerk
        skip_password_checks: false,
        skip_password_requirement: false,
      }),
    });

    const data = await result.json();

    if (!result.ok) {
      console.error("Clerk API Error:", data);
      return NextResponse.json(
        { error: data?.errors?.[0]?.message || "Failed to create account" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, userId: data.id });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Server error during registration" },
      { status: 500 }
    );
  }
}
