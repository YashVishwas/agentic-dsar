import { NextResponse } from "next/server";
import { reviewUserDataForDeletion } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { email, userData } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    if (!userData) {
      return NextResponse.json(
        { error: "User data is required" },
        { status: 400 }
      );
    }
    
    // Use OpenAI to review the user data for deletion
    const review = await reviewUserDataForDeletion(email, userData);
    
    return NextResponse.json({
      email,
      review,
    });
  } catch (error) {
    console.error("Error reviewing user data:", error);
    return NextResponse.json(
      { error: "Failed to review user data for deletion" },
      { status: 500 }
    );
  }
}

