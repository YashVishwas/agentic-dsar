"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, CheckCircle2, ExternalLink, Link as LinkIcon } from "lucide-react";

interface ComposioApp {
  key: string;
  name: string;
  description?: string;
  logo?: string;
  appId?: string;
  categories?: string[];
  showActiveIcon?: boolean;
}

export function AppDiscoveryTab() {
  const [apps, setApps] = useState<ComposioApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<ComposioApp[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredApps, setRegisteredApps] = useState<string[]>([]);

  useEffect(() => {
    loadApps();
    loadRegisteredApps();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = apps.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredApps(filtered);
    } else {
      setFilteredApps(apps);
    }
  }, [searchQuery, apps]);

  const loadApps = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/app-discovery");
      
      if (!response.ok) {
        throw new Error("Failed to load apps");
      }

      const data = await response.json();
      
      // Map the Composio apps to our interface
      const mappedApps = (data.apps || []).map((app: any) => ({
        key: app.key || app.appId || app.name?.toLowerCase(),
        name: app.name || app.key,
        description: app.description || "",
        logo: app.logo || app.logoUrl || "",
        appId: app.appId || app.key,
        categories: app.categories || [],
      }));
      
      setApps(mappedApps);
      setFilteredApps(mappedApps);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load apps");
      console.error("Error loading apps:", err);
      // Set some dummy data for demo purposes if API fails
      const dummyApps = [
        { key: "hubspot", name: "HubSpot", description: "CRM and Marketing Platform", logo: "" },
        { key: "zendesk", name: "Zendesk", description: "Customer Service Platform", logo: "" },
        { key: "salesforce", name: "Salesforce", description: "CRM Platform", logo: "" },
        { key: "slack", name: "Slack", description: "Team Communication", logo: "" },
        { key: "gmail", name: "Gmail", description: "Email Service", logo: "" },
        { key: "github", name: "GitHub", description: "Code Hosting Platform", logo: "" },
      ];
      setApps(dummyApps);
      setFilteredApps(dummyApps);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRegisteredApps = async () => {
    try {
      const response = await fetch("/api/registered-apps");
      if (response.ok) {
        const data = await response.json();
        const registered = data.apps
          .filter((app: any) => app.authenticated)
          .map((app: any) => app.id);
        setRegisteredApps(registered);
      }
    } catch (err) {
      console.error("Failed to load registered apps:", err);
    }
  };

  const handleAuthenticate = (appKey: string) => {
    // Open Composio authentication flow
    window.open(
      `https://app.composio.dev/apps/${appKey}`,
      "_blank",
      "width=600,height=700"
    );
  };

  const isRegistered = (appKey: string) => {
    return registeredApps.includes(appKey);
  };

  const getAppInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button 
            onClick={loadApps} 
            variant="outline" 
            disabled={isLoading}
            className="h-12 px-6"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-yellow-700 bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <p className="font-semibold mb-1">Unable to fetch apps from Composio</p>
            <p>{error}</p>
            <p className="mt-2 text-xs">
              Make sure COMPOSIO_API_KEY is set in your .env.local file. Showing sample apps for demonstration.
            </p>
          </div>
        )}
      </div>

      {/* Apps List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">
            {searchQuery ? "No apps found matching your search" : "No apps available"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Registered Apps Section */}
          {filteredApps.filter((app) => isRegistered(app.key)).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Registered</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    {filteredApps.filter((app) => isRegistered(app.key)).length}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
                {filteredApps
                  .filter((app) => isRegistered(app.key))
                  .map((app) => {
                    const registered = true;
                    return (
                      <div
                        key={app.key}
                        className="group hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 p-5"
                      >
                        <div className="flex items-center gap-4">
                          {/* App Icon */}
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl shadow-md overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                            {app.logo ? (
                              <img 
                                src={app.logo} 
                                alt={`${app.name} logo`}
                                className="w-10 h-10 object-contain p-1"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.className = "flex-shrink-0 w-12 h-12 rounded-xl shadow-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600";
                                    parent.innerHTML = `<span class="text-white font-bold text-sm">${getAppInitials(app.name)}</span>`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-green-500 to-emerald-600">
                                {getAppInitials(app.name)}
                              </div>
                            )}
                          </div>

                          {/* App Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {app.name}
                              </h3>
                              <Badge 
                                variant="success" 
                                className="flex items-center gap-1 px-2 py-0.5"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                <span className="text-xs">Registered</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-500">{app.key}</span>
                              {app.description && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-gray-600 truncate">
                                    {app.description}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex-shrink-0">
                            <Button
                              onClick={() => handleAuthenticate(app.key)}
                              variant="outline"
                              className="min-w-[140px] border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              <LinkIcon className="mr-2 h-4 w-4" />
                              Manage
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Discovered Apps Section */}
          {filteredApps.filter((app) => !isRegistered(app.key)).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <Search className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Discovered</span>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    {filteredApps.filter((app) => !isRegistered(app.key)).length}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
                {filteredApps
                  .filter((app) => !isRegistered(app.key))
                  .map((app) => {
                    const registered = false;
                    return (
                      <div
                        key={app.key}
                        className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 p-5"
                      >
                        <div className="flex items-center gap-4">
                          {/* App Icon */}
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl shadow-md overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                            {app.logo ? (
                              <img 
                                src={app.logo} 
                                alt={`${app.name} logo`}
                                className="w-10 h-10 object-contain p-1"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.className = "flex-shrink-0 w-12 h-12 rounded-xl shadow-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600";
                                    parent.innerHTML = `<span class="text-white font-bold text-sm">${getAppInitials(app.name)}</span>`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-blue-500 to-indigo-600">
                                {getAppInitials(app.name)}
                              </div>
                            )}
                          </div>

                          {/* App Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {app.name}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className="flex items-center gap-1 px-2 py-0.5 border-blue-200 text-blue-700"
                              >
                                <Search className="h-3 w-3" />
                                <span className="text-xs">Discovered</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-500">{app.key}</span>
                              {app.description && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-gray-600 truncate">
                                    {app.description}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex-shrink-0">
                            <Button
                              onClick={() => handleAuthenticate(app.key)}
                              variant="default"
                              className="min-w-[140px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Authenticate
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      {filteredApps.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredApps.length} {filteredApps.length === 1 ? "application" : "applications"}
        </div>
      )}
    </div>
  );
}

