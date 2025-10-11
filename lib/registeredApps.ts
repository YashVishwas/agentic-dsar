export interface RegisteredApp {
  id: string;
  name: string;
  authenticated: boolean;
  scopes: string[];
  logo: string;
}

// In-memory store with active apps
export const registeredApps: RegisteredApp[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    authenticated: true,
    scopes: ["contacts", "crm.objects.contacts.read", "crm.objects.contacts.write"],
    logo: "/logos/hubspot.svg",
  },
  {
    id: "asana",
    name: "Asana",
    authenticated: true,
    scopes: ["tasks", "projects", "workspaces"],
    logo: "/logos/asana.svg",
  },
  {
    id: "shopify",
    name: "Shopify",
    authenticated: true,
    scopes: ["customers", "orders", "products"],
    logo: "/logos/shopify.svg",
  },
  {
    id: "meta",
    name: "Meta Ads",
    authenticated: true,
    scopes: ["ads", "campaigns", "insights"],
    logo: "/logos/meta-icon.svg",
  },
];

export function getRegisteredApps(): RegisteredApp[] {
  return registeredApps;
}

export function getRegisteredApp(id: string): RegisteredApp | undefined {
  return registeredApps.find((app) => app.id === id);
}

