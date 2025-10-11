import { NextResponse } from "next/server";
import { getRegisteredApps } from "@/lib/registeredApps";
import { searchHubSpotContact } from "@/lib/composio";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Step 1: Get registered apps
    const registeredApps = getRegisteredApps();
    
    // Step 2: Search for user in each authenticated app
    const results = [];
    
    for (const app of registeredApps) {
      if (!app.authenticated) {
        results.push({
          appId: app.id,
          appName: app.name,
          found: false,
          status: "not_authenticated",
          message: "App is not authenticated",
        });
        continue;
      }
      
      try {
        if (app.id === "hubspot") {
          const searchResult = await searchHubSpotContact(email);
          
          const found = searchResult && 
                       searchResult.data && 
                       searchResult.data.results && 
                       searchResult.data.results.length > 0;
          
          results.push({
            appId: app.id,
            appName: app.name,
            found,
            status: "success",
            data: found ? searchResult.data.results[0] : null,
          });
        } else {
          // Placeholder for other apps
          results.push({
            appId: app.id,
            appName: app.name,
            found: false,
            status: "not_implemented",
            message: "Search not implemented for this app yet",
          });
        }
      } catch (error) {
        console.error(`Error searching ${app.name}:`, error);
        results.push({
          appId: app.id,
          appName: app.name,
          found: false,
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
    
    return NextResponse.json({
      email,
      results,
      summary: {
        total: results.length,
        found: results.filter((r) => r.found).length,
        notFound: results.filter((r) => !r.found).length,
      },
    });
  } catch (error) {
    console.error("Error in user discovery:", error);
    return NextResponse.json(
      { error: "Failed to perform user discovery" },
      { status: 500 }
    );
  }
}

