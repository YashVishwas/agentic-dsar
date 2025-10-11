// Use REST API for all Composio operations to avoid SDK dependency issues

export async function searchHubSpotContact(email: string) {
  try {
    const apiKey = process.env.COMPOSIO_API_KEY;
    
    if (!apiKey) {
      throw new Error("COMPOSIO_API_KEY environment variable is not set");
    }
    
    // Use Composio REST API to search for contact by email
    const response = await fetch("https://backend.composio.dev/api/v2/actions/HUBSPOT_SEARCH_CONTACTS/execute", {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          query: email,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: email,
                },
              ],
            },
          ],
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Composio API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error searching HubSpot contact:", error);
    throw error;
  }
}

export async function deleteHubSpotContact(email: string) {
  try {
    const apiKey = process.env.COMPOSIO_API_KEY;
    
    if (!apiKey) {
      throw new Error("COMPOSIO_API_KEY environment variable is not set");
    }
    
    // Use Composio REST API to delete contact for GDPR compliance
    const response = await fetch("https://backend.composio.dev/api/v2/actions/HUBSPOT_DELETE_CONTACT_GDPR/execute", {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          objectId: email,
          idProperty: "email",
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Composio API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting HubSpot contact:", error);
    throw error;
  }
}

export async function getComposioApps() {
  try {
    const apiKey = process.env.COMPOSIO_API_KEY;
    
    if (!apiKey) {
      throw new Error("COMPOSIO_API_KEY environment variable is not set");
    }
    
    // Use Composio REST API to fetch apps
    const response = await fetch("https://backend.composio.dev/api/v1/apps", {
      headers: {
        "X-API-Key": apiKey,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Composio API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the apps array with all metadata
    return data.items || data.apps || data || [];
  } catch (error) {
    console.error("Error fetching Composio apps:", error);
    throw error;
  }
}

export async function getAppDetails(appKey: string) {
  try {
    const apiKey = process.env.COMPOSIO_API_KEY;
    
    if (!apiKey) {
      throw new Error("COMPOSIO_API_KEY environment variable is not set");
    }
    
    // Use Composio REST API to fetch app details
    const response = await fetch(`https://backend.composio.dev/api/v1/apps/${appKey}`, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Composio API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching app details for ${appKey}:`, error);
    throw error;
  }
}

