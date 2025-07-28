// app/api/clerk-login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create a session with Clerk using the Sessions API
    const result = await fetch("https://api.clerk.com/v1/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        strategy: "password",
        identifier: email,
        password: password,
      }),
    });

    const data = await result.json();

    if (!result.ok) {
      console.error("Clerk Login Error:", data);
      
      // Handle specific Clerk error messages
      let errorMessage = "Login failed";
      if (data?.errors?.[0]?.message) {
        errorMessage = data.errors[0].message;
      } else if (data?.error) {
        errorMessage = data.error;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: result.status }
      );
    }

    // Return success with session data
    return NextResponse.json({ 
      success: true, 
      sessionId: data.id,
      userId: data.user_id,
      token: data.last_active_token?.jwt // JWT token for client-side auth
    });

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Server error during login" },
      { status: 500 }
    );
  }
}

// Alternative approach using Clerk's sign-in endpoint
export async function PUT(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Use Clerk's sign-in attempts API
    const signInAttempt = await fetch("https://api.clerk.com/v1/sign_in_attempts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        strategy: "password",
        identifier: email,
        password: password,
      }),
    });

    const attemptData = await signInAttempt.json();

    if (!signInAttempt.ok) {
      console.error("Clerk Sign-in Attempt Error:", attemptData);
      return NextResponse.json(
        { error: attemptData?.errors?.[0]?.message || "Sign-in failed" },
        { status: signInAttempt.status }
      );
    }

    // If sign-in attempt was successful, create a session
    if (attemptData.status === "complete") {
      return NextResponse.json({
        success: true,
        sessionId: attemptData.session_id,
        userId: attemptData.user_id,
      });
    }

    return NextResponse.json(
      { error: "Sign-in attempt incomplete" },
      { status: 400 }
    );

  } catch (err) {
    console.error("Sign-in attempt error:", err);
    return NextResponse.json(
      { error: "Server error during sign-in" },
      { status: 500 }
    );
  }
}
