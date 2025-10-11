"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Play, Download, Trash2, X, FileText, UserCircle, Sparkles } from "lucide-react";
import { DiscoveryFlow } from "@/components/DiscoveryFlow";

interface Request {
  id: string;
  dataSubject: string;
  email: string;
  requestType: "Deletion" | "Download";
  requestDate: string;
  createdBy: string;
  assignee: string;
  status: "Open" | "Unverified";
}

// Dummy data based on the provided names and emails
const dummyRequests: Request[] = [
  {
    id: "DEL-43",
    dataSubject: "Jacob Moore",
    email: "jacob.moore54@email.com",
    requestType: "Deletion",
    requestDate: "Feb 5, 2025",
    createdBy: "Agent",
    assignee: "I",
    status: "Open",
  },
  {
    id: "DOW-42",
    dataSubject: "Ella Kim",
    email: "ella.kim001@email.com",
    requestType: "Download",
    requestDate: "Mar 21, 2025",
    createdBy: "Agent",
    assignee: "I",
    status: "Open",
  },
  {
    id: "DOW-41",
    dataSubject: "Liam Carter",
    email: "liam.carter889@email.com",
    requestType: "Download",
    requestDate: "Mar 19, 2025",
    createdBy: "Agent",
    assignee: "I",
    status: "Open",
  },
  {
    id: "DOW-40",
    dataSubject: "Chloe Evans",
    email: "chloe.evans22@email.com",
    requestType: "Download",
    requestDate: "Mar 17, 2025",
    createdBy: "Agent",
    assignee: "I",
    status: "Unverified",
  },
  {
    id: "DEL-39",
    dataSubject: "Mason Rivera",
    email: "mason.rivera@email.com",
    requestType: "Deletion",
    requestDate: "Mar 6, 2025",
    createdBy: "Agent",
    assignee: "RK",
    status: "Unverified",
  },
  {
    id: "DOW-38",
    dataSubject: "Sophia Patel",
    email: "sophia.patel77@email.com",
    requestType: "Download",
    requestDate: "Feb 17, 2025",
    createdBy: "Data Subject",
    assignee: "AR",
    status: "Unverified",
  },
  {
    id: "DEL-37",
    dataSubject: "Ethan Brooks",
    email: "ethan.brooks246@email.com",
    requestType: "Deletion",
    requestDate: "Feb 13, 2025",
    createdBy: "Agent",
    assignee: "YS",
    status: "Unverified",
  },
  {
    id: "DEL-34",
    dataSubject: "Mia Harper",
    email: "mia.harper@email.com",
    requestType: "Deletion",
    requestDate: "Feb 12, 2025",
    createdBy: "Agent",
    assignee: "I",
    status: "Open",
  },
  {
    id: "DOW-33",
    dataSubject: "Lucas Bennett",
    email: "lucas.ben123@email.com",
    requestType: "Download",
    requestDate: "Feb 10, 2025",
    createdBy: "Agent",
    assignee: "I",
    status: "Open",
  },
  {
    id: "DOW-32",
    dataSubject: "Ava Thompson",
    email: "ava.thompson98@email.com",
    requestType: "Download",
    requestDate: "Feb 8, 2025",
    createdBy: "Agent",
    assignee: "I",
    status: "Open",
  },
  {
    id: "DEL-31",
    dataSubject: "Brian Halligan",
    email: "bh@hubspot.com",
    requestType: "Deletion",
    requestDate: "Feb 5, 2025",
    createdBy: "Data Subject",
    assignee: "I",
    status: "Open",
  },
  {
    id: "DOW-30",
    dataSubject: "Maria Johnson",
    email: "emailmaria@hubspot.com",
    requestType: "Download",
    requestDate: "Feb 3, 2025",
    createdBy: "Agent",
    assignee: "I",
    status: "Open",
  },
];

export function RequestTab() {
  const [activeTab, setActiveTab] = useState<"in-progress" | "closed">("in-progress");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [activeDataTab, setActiveDataTab] = useState<"user-data" | "events">("user-data");
  const [agentHandoffStarted, setAgentHandoffStarted] = useState(false);

  const inProgressRequests = dummyRequests;
  const inProgressCount = inProgressRequests.length;
  const closedCount = 72;

  // Registered apps for the detailed view
  const registeredApps = [
    { id: "hubspot", name: "HubSpot", hasData: true, dataFile: "UserData_Hubspot_2024.csv" },
    { id: "asana", name: "Asana", hasData: true, dataFile: "UserData_Asana_2024.csv" },
    { id: "shopify", name: "Shopify", hasData: false, dataFile: null },
    { id: "meta", name: "Meta Ads", hasData: false, dataFile: null },
  ];

  const filteredRequests = inProgressRequests.filter(
    (request) =>
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.dataSubject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If a request is selected, show detailed view
  if (selectedRequest) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedRequest(null);
                setAgentHandoffStarted(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <div>
              <div className="text-sm text-gray-500">Requests / {selectedRequest.id}</div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedRequest.requestType === "Deletion" ? "Data Deletion Request" : "Data Download Request"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <UserCircle className="h-4 w-4 mr-2" />
              Assign User
            </Button>
            <Button 
              onClick={() => setAgentHandoffStarted(true)}
              disabled={agentHandoffStarted}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Agent Handoff
            </Button>
          </div>
        </div>

        {/* Request Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <Badge
                className={
                  selectedRequest.status === "Open"
                    ? "ml-2 bg-blue-100 text-blue-700"
                    : "ml-2 bg-amber-100 text-amber-700"
                }
              >
                {selectedRequest.status}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-gray-500">Request Date:</span>
              <span className="ml-2 text-sm font-medium">{selectedRequest.requestDate}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Assignee:</span>
              <span className="ml-2 text-sm font-medium">{selectedRequest.dataSubject}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <span className="text-sm text-gray-500">Data Subject:</span>
              <span className="ml-2 text-sm font-medium">{selectedRequest.dataSubject}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <span className="ml-2 text-sm font-medium">{selectedRequest.email}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Country:</span>
              <span className="ml-2 text-sm font-medium">United States</span>
            </div>
          </div>
        </div>

        {/* Discovery Flow */}
        {agentHandoffStarted && (
          <DiscoveryFlow 
            email={selectedRequest.email} 
            autoStart={true}
            onComplete={() => {
              // Optional: Add completion handling
            }}
          />
        )}
        
        {!agentHandoffStarted && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Agent Handoff</h3>
            <p className="text-gray-600 mb-6">
              Click "Agent Handoff" above to start the automated discovery and deletion workflow for {selectedRequest.email}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("in-progress")}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === "in-progress"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            In Progress <span className="ml-2">{inProgressCount}</span>
          </button>
          <button
            onClick={() => setActiveTab("closed")}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === "closed"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Closed <span className="ml-2">{closedCount}</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{filteredRequests.length} Items</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Filters (if shown) */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <Plus className="h-4 w-4" />
            Add Filter
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Request</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data Subject</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Request Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Request Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created By</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assignee</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      {request.id}
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.dataSubject}</div>
                      <div className="text-xs text-gray-500">{request.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      {request.requestType === "Deletion" ? (
                        <>
                          <Trash2 className="h-4 w-4 text-gray-400" />
                          Deletion
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 text-gray-400" />
                          Download
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{request.requestDate}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{request.createdBy}</td>
                  <td className="py-3 px-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                      {request.assignee}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={request.status === "Open" ? "default" : "secondary"}
                      className={
                        request.status === "Open"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }
                    >
                      {request.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                      title="View Request Details"
                    >
                      <Play className="h-5 w-5 text-blue-600 fill-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State for Closed */}
      {activeTab === "closed" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No closed requests to display</p>
        </div>
      )}
    </div>
  );
}

