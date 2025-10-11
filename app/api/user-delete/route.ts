import { NextResponse } from "next/server";
import { deleteHubSpotContact } from "@/lib/composio";
import { getRegisteredApp } from "@/lib/registeredApps";

export async function POST(request: Request) {
  try {
    const { email, appId, confirmation } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    if (!appId) {
      return NextResponse.json(
        { error: "App ID is required" },
        { status: 400 }
      );
    }
    
    if (!confirmation) {
      return NextResponse.json(
        { error: "User confirmation is required" },
        { status: 400 }
      );
    }
    
    // Verify the app is registered
    const app = getRegisteredApp(appId);
    if (!app) {
      return NextResponse.json(
        { error: "App not found in registered apps" },
        { status: 404 }
      );
    }
    
    if (!app.authenticated) {
      return NextResponse.json(
        { error: "App is not authenticated" },
        { status: 401 }
      );
    }
    
    // Perform deletion based on app type
    try {
      if (appId === "hubspot") {
        const result = await deleteHubSpotContact(email);
        
        return NextResponse.json({
          success: true,
          appId,
          appName: app.name,
          email,
          result,
          message: "User data deleted successfully",
        });
      } else {
        return NextResponse.json(
          { error: "Deletion not implemented for this app yet" },
          { status: 501 }
        );
      }
    } catch (error) {
      console.error(`Error deleting from ${app.name}:`, error);
      return NextResponse.json(
        { 
          error: "Failed to delete user data",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in user deletion:", error);
    return NextResponse.json(
      { error: "Failed to process deletion request" },
      { status: 500 }
    );
  }
}

