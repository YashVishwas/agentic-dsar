import { NextResponse } from "next/server";
import { getRegisteredApps } from "@/lib/registeredApps";

export async function GET() {
  try {
    const apps = getRegisteredApps();
    return NextResponse.json({ apps });
  } catch (error) {
    console.error("Error fetching registered apps:", error);
    return NextResponse.json(
      { error: "Failed to fetch registered apps" },
      { status: 500 }
    );
  }
}

