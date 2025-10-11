export interface RegisteredApp {
  id: string;
  name: string;
  authenticated: boolean;
  scopes: string[];
}

// In-memory store with active apps
export const registeredApps: RegisteredApp[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    authenticated: true,
    scopes: ["contacts", "crm.objects.contacts.read", "crm.objects.contacts.write"],
  },
  {
    id: "asana",
    name: "Asana",
    authenticated: true,
    scopes: ["tasks", "projects", "workspaces"],
  },
  {
    id: "shopify",
    name: "Shopify",
    authenticated: true,
    scopes: ["customers", "orders", "products"],
  },
  {
    id: "meta",
    name: "Meta Ads",
    authenticated: true,
    scopes: ["ads", "campaigns", "insights"],
  },
];

export function getRegisteredApps(): RegisteredApp[] {
  return registeredApps;
}

export function getRegisteredApp(id: string): RegisteredApp | undefined {
  return registeredApps.find((app) => app.id === id);
}

