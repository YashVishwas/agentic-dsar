"use client";

import React, { useState } from "react";
import { RequestTab } from "@/components/RequestTab";
import { UserDiscoveryTab } from "@/components/UserDiscoveryTab";
import { AppDiscoveryTab } from "@/components/AppDiscoveryTab";
import { Shield, FileText, Search, Grid, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [activeTab, setActiveTab] = useState("request");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const tabs = [
    { id: "request", label: "Request", icon: FileText },
    { id: "app-discovery", label: "App Discovery", icon: Grid },
    { id: "user-discovery", label: "User Discovery", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar - Fixed Position */}
      <div
        className={`${
          isSidebarCollapsed ? "w-20" : "w-64"
        } fixed top-0 left-0 h-screen bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out flex flex-col z-50`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md flex-shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                  IX Labs
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-500"}`} />
                    {!isSidebarCollapsed && (
                      <span className="font-medium truncate">{tab.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content - with margin for fixed sidebar */}
      <div 
        className={`${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300 ease-in-out min-h-screen`}
      >
        <div className="container mx-auto px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">
              {activeTab === "request" && "Manage Data Subject Request"}
              {activeTab === "app-discovery" && "Browse and authenticate with supported applications"}
              {activeTab === "user-discovery" && "Search for user data across registered applications"}
            </p>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === "request" && <RequestTab />}
            {activeTab === "app-discovery" && <AppDiscoveryTab />}
            {activeTab === "user-discovery" && <UserDiscoveryTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

