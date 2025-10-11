import { NextResponse } from "next/server";
import { getComposioApps } from "@/lib/composio";

export async function GET() {
  try {
    const apps = await getComposioApps();
    
    // Log the structure of the first app for debugging
    if (apps && apps.length > 0) {
      console.log("Sample app structure from Composio:", JSON.stringify(apps[0], null, 2));
      console.log(`Total apps fetched: ${apps.length}`);
    }
    
    return NextResponse.json({ 
      apps,
      count: apps?.length || 0 
    });
  } catch (error) {
    console.error("Error fetching Composio apps:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch apps from Composio",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

