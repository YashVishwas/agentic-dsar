"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, AlertCircle, Trash2, Mail, Send } from "lucide-react";

interface Hit {
  provider: string;
  resourceType: string;
  nativeId: string;
  matchFields: string[];
  count: number;
  confidence: number;
  actionHint: string;
  reason: string;
  previewUrl: string;
  evidenceRef: string;
}

interface AppStatus {
  appId: string;
  appName: string;
  logo: string;
  status: "idle" | "searching" | "found" | "not-found" | "complete" | "deleting" | "deleted";
  hits?: Hit[];
}

interface DiscoveryFlowProps {
  email: string;
  onComplete?: () => void;
  autoStart?: boolean;
}

const knownEmails = [
  "jacob.moore54@email.com",
  "ella.kim001@email.com",
  "liam.carter889@email.com",
  "chloe.evans22@email.com",
  "mason.rivera@email.com",
  "sophia.patel77@email.com",
  "ethan.brooks246@email.com",
  "mia.harper@email.com",
  "lucas.ben123@email.com",
  "ava.thompson98@email.com",
  "bh@hubspot.com",
  "emailmaria@hubspot.com",
];

export function DiscoveryFlow({ email, onComplete, autoStart = false }: DiscoveryFlowProps) {
  const [currentStep, setCurrentStep] = useState<
    "idle" | "searching" | "results" | "review" | "ready-to-delete" | "deleting" | "deleted" | "email-acknowledgement"
  >(autoStart ? "searching" : "idle");
  const [appStatuses, setAppStatuses] = useState<AppStatus[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const registeredApps = [
    { id: "hubspot", name: "HubSpot", logo: "H" },
    { id: "asana", name: "Asana", logo: "A" },
    { id: "shopify", name: "Shopify", logo: "S" },
    { id: "meta", name: "Meta Ads", logo: "M" },
  ];

  const foundApps = appStatuses.filter((app) => app.hits && app.hits.length > 0);

  React.useEffect(() => {
    if (autoStart && email) {
      handleDiscover();
    }
  }, [autoStart, email]);

  const handleDiscover = async () => {
    setCurrentStep("searching");

    const initialStatuses: AppStatus[] = registeredApps.map((app) => ({
      appId: app.id,
      appName: app.name,
      logo: app.logo,
      status: "searching",
    }));
    setAppStatuses(initialStatuses);

    // Check if email is in known list
    const isKnownEmail = knownEmails.includes(email.toLowerCase());

    // Build the final statuses array as we go
    let currentStatuses = [...initialStatuses];

    // Simulate searching each app with delays
    for (let i = 0; i < registeredApps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

      // Dummy data - if known email, always find in all apps. Otherwise random.
      const found = isKnownEmail ? true : Math.random() > 0.3; // Known emails always found

      currentStatuses[i] = {
        ...currentStatuses[i],
        status: found ? "found" : "not-found",
        hits: found
          ? [
              {
                provider: registeredApps[i].id,
                resourceType: "contact",
                nativeId: `${Math.floor(Math.random() * 90000) + 10000}`,
                matchFields: [`email:${email}`],
                count: Math.floor(Math.random() * 3) + 1,
                confidence: 0.95 + Math.random() * 0.04,
                actionHint: "DELETE",
                reason: "User contact record; no statutory retention requirement",
                previewUrl: `https://app.${registeredApps[i].id}.com/contacts/${Math.floor(
                  Math.random() * 90000
                )}`,
                evidenceRef: `rcpt_${registeredApps[i].id}_001`,
              },
            ]
          : undefined,
      };

      setAppStatuses([...currentStatuses]);
    }

    // Mark all as complete (keep the hits data)
    const finalStatuses = currentStatuses.map((status) => ({
      ...status,
      status: "complete" as const,
    }));
    setAppStatuses(finalStatuses);

    setCurrentStep("results");
  };

  const handleReview = async () => {
    setCurrentStep("review");
    setIsReviewing(true);

    // Simulate AI review
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsReviewing(false);
    setCurrentStep("ready-to-delete");
  };

  const handleDelete = async () => {
    setCurrentStep("deleting");

    // Get only apps with data
    const appsToDelete = appStatuses.filter((app) => app.hits && app.hits.length > 0);
    
    // Delete from each app progressively
    for (let i = 0; i < appsToDelete.length; i++) {
      const currentApp = appsToDelete[i];
      
      // Mark as deleting
      setAppStatuses((prev) =>
        prev.map((app) =>
          app.appId === currentApp.appId ? { ...app, status: "deleting" } : app
        )
      );

      // Simulate deletion time
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

      // Mark as deleted
      setAppStatuses((prev) =>
        prev.map((app) =>
          app.appId === currentApp.appId ? { ...app, status: "deleted" } : app
        )
      );
    }

    // Wait a moment before showing success
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setCurrentStep("deleted");
  };

  const handleSendEmail = async () => {
    setEmailSent(true);
    
    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (onComplete) {
      onComplete();
    }
  };

  if (currentStep === "idle") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Searching Apps */}
      {(currentStep === "searching" ||
        currentStep === "results" ||
        currentStep === "review" ||
        currentStep === "ready-to-delete" ||
        currentStep === "deleting" ||
        currentStep === "deleted" ||
        currentStep === "email-acknowledgement") && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-lg font-bold text-blue-600">1</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Searching Registered Apps</h3>
              <p className="text-sm text-gray-600">Scanning for data subject across connected applications</p>
            </div>
          </div>

          {/* App List - matching App Discovery style */}
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100 mb-6">
            {appStatuses.map((app) => (
              <div
                key={app.appId}
                className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 p-5"
              >
                <div className="flex items-center gap-4">
                  {/* App Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl shadow-md overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ${
                        app.status === "searching"
                          ? "bg-gray-400 animate-pulse"
                          : app.status === "found"
                          ? "bg-gradient-to-br from-green-500 to-emerald-600"
                          : app.status === "not-found"
                          ? "bg-gradient-to-br from-gray-300 to-gray-400"
                          : app.status === "complete" && app.hits
                          ? "bg-gradient-to-br from-green-500 to-emerald-600"
                          : "bg-gradient-to-br from-blue-500 to-indigo-600"
                      }`}
                    >
                      {app.logo}
                    </div>
                  </div>

                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{app.appName}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">{app.appId}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600 truncate">Registered application</span>
                    </div>
                  </div>

                  {/* Status - right aligned */}
                  <div className="flex-shrink-0 min-w-[140px] flex justify-end">
                    {app.status === "searching" && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-sm text-blue-600 font-medium">Searching...</span>
                      </div>
                    )}
                    {app.status === "found" && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-semibold text-green-700">Data Found</span>
                      </div>
                    )}
                    {app.status === "not-found" && (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">No Data</span>
                      </div>
                    )}
                    {app.status === "complete" && !app.hits && (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">No Data</span>
                      </div>
                    )}
                    {app.status === "complete" && app.hits && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-semibold text-green-700">
                          {app.hits.length} hit{app.hits.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentStep !== "searching" && foundApps.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold mb-4">Data Subject Location Index</h4>
              <div className="space-y-4">
                {foundApps.map((app) =>
                  app.hits?.map((hit, idx) => (
                    <div key={`${app.appId}-${idx}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Provider</div>
                          <div className="font-medium text-gray-900">{app.appName}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Resource Type</div>
                          <div className="font-medium text-gray-900">{hit.resourceType}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Native ID</div>
                          <div className="font-mono text-sm text-gray-700">{hit.nativeId}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Match Fields</div>
                          <div className="text-sm text-gray-700">{hit.matchFields.join(", ")}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Confidence</div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-900">{(hit.confidence * 100).toFixed(1)}%</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${hit.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Action Hint</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-red-600">{hit.actionHint}</span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-gray-500 mb-1">Reason</div>
                          <div className="text-sm text-gray-700">{hit.reason}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Preview URL</div>
                          <a href={hit.previewUrl} className="text-sm text-blue-600 hover:underline" target="_blank">
                            View Record
                          </a>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Evidence Ref</div>
                          <div className="font-mono text-xs text-gray-600">{hit.evidenceRef}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {currentStep === "results" && foundApps.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleReview} className="bg-blue-600 text-white hover:bg-blue-700">
                Proceed to Policy Review
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Policy Compliance Review */}
      {(currentStep === "review" || currentStep === "ready-to-delete" || currentStep === "deleting" || currentStep === "deleted" || currentStep === "email-acknowledgement") && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-lg font-bold text-purple-600">2</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Policy Compliance Review</h3>
              <p className="text-sm text-gray-600">Analyzing data for CCPA/CPRA deletion compliance</p>
            </div>
          </div>

          {isReviewing ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600">AI Policy Reviewer analyzing records...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-2">All Clear for Deletion</h4>
                  <p className="text-sm text-green-800 mb-3">
                    All discovered user data has been reviewed and approved for deletion under CCPA/CPRA compliance
                    regulations.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-green-900">Records Analyzed:</span>{" "}
                      <span className="text-green-800">{foundApps.reduce((acc, app) => acc + (app.hits?.length || 0), 0)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-green-900">Compliance Status:</span>{" "}
                      <span className="text-green-800">Compliant with CCPA/CPRA</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-green-900">Legal Holds:</span>{" "}
                      <span className="text-green-800">None detected</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-green-900">Retention Requirements:</span>{" "}
                      <span className="text-green-800">No statutory obligations</span>
                    </div>
                  </div>
                </div>
              </div>

              {currentStep === "ready-to-delete" && (
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Execute Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Execute Delete */}
      {(currentStep === "deleting" || currentStep === "deleted" || currentStep === "email-acknowledgement") && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-lg font-bold text-red-600">3</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Execute Delete</h3>
              <p className="text-sm text-gray-600">Deleting user data from all registered applications</p>
            </div>
          </div>

          {/* App List with Deletion Status */}
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100 mb-6">
            {foundApps.map((app) => (
              <div
                key={app.appId}
                className="group hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 p-5"
              >
                <div className="flex items-center gap-4">
                  {/* App Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl shadow-md overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ${
                        app.status === "deleting"
                          ? "bg-gradient-to-br from-orange-500 to-red-600 animate-pulse"
                          : app.status === "deleted"
                          ? "bg-gradient-to-br from-gray-400 to-gray-500"
                          : "bg-gradient-to-br from-green-500 to-emerald-600"
                      }`}
                    >
                      {app.logo}
                    </div>
                  </div>

                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{app.appName}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">{app.appId}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600 truncate">
                        {app.hits?.length} record{app.hits && app.hits.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Deletion Status - right aligned */}
                  <div className="flex-shrink-0 min-w-[140px] flex justify-end">
                    {app.status === "deleting" && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        <span className="text-sm text-red-600 font-medium">Deleting...</span>
                      </div>
                    )}
                    {app.status === "deleted" && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">Deleted</span>
                      </div>
                    )}
                    {app.status === "complete" && currentStep === "deleting" && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Pending...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Success Message */}
          {currentStep === "deleted" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-2">Successfully Deleted</h4>
                  <p className="text-sm text-green-800 mb-3">
                    User data for <span className="font-mono font-semibold">{email}</span> has been permanently removed from{" "}
                    {foundApps.length} application{foundApps.length > 1 ? "s" : ""}.
                  </p>
                  <div className="text-sm text-green-700">
                    <p>Compliance record generated and logged</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setCurrentStep("email-acknowledgement")}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Continue to Acknowledgement
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Email Acknowledgement */}
      {currentStep === "email-acknowledgement" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-lg font-bold text-blue-600">4</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Acknowledgement Email</h3>
              <p className="text-sm text-gray-600">Review and send deletion confirmation to the data subject</p>
            </div>
          </div>

          {/* Email Template */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 font-mono text-sm">
            <div className="space-y-4">
              <div>
                <div className="text-gray-500 text-xs mb-1">Subject:</div>
                <div className="font-semibold">Your data deletion request — confirmation (Case DEL-{Math.floor(Math.random() * 100)})</div>
              </div>

              <div className="border-t border-gray-300 pt-4">
                <p className="mb-4">Hi {email.split("@")[0]},</p>

                <p className="mb-4">
                  We've completed your deletion request (received {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}; completed{" "}
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}), Case DEL-{Math.floor(Math.random() * 100)}.
                </p>

                <p className="font-semibold mb-2">What we deleted</p>
                <p className="mb-4">
                  Customer profile data in: {foundApps.map((app) => `${app.appName} (${app.hits?.[0]?.resourceType || "contact"})`).join(", ")}.
                </p>
                <p className="mb-4">
                  Marketing/communications: your profile removed and global suppression applied.
                </p>

                <p className="font-semibold mb-2">What we retained (and why)</p>
                <p className="mb-4">
                  Transaction records retained for legal/financial obligations. We minimized these (e.g., masked name/email) and will keep them only until{" "}
                  {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.
                </p>
                <p className="mb-4">
                  Backups/archives: we do not restore backups for routine use. If a backup is restored, your data will be deleted again as part of the restore process. Current backup expiry:{" "}
                  {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.
                </p>

                <p className="font-semibold mb-2">Vendors/sub-processors</p>
                <p className="mb-4">
                  We instructed our service providers to delete your data where applicable and are tracking acknowledgments.
                </p>

                <p className="font-semibold mb-2">Next steps / your options</p>
                <p className="mb-2">If anything looks incomplete or you have questions, reply to this email.</p>
                <p className="mb-4">
                  If you believe we got this wrong, you may appeal by writing to privacy-appeals@company.com within 45 days. We'll respond with the outcome and reasons.
                </p>
                <p className="mb-4">
                  You can access a record of actions taken here: https://privacy.company.com/case/{Math.floor(Math.random() * 10000)} (expires in 30 days).
                </p>

                <p className="mt-6">
                  Thank you,<br />
                  Company Privacy Team<br />
                  privacy@company.com | 123 Privacy St, San Francisco, CA 94105
                </p>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <Mail className="inline h-4 w-4 mr-2" />
              Email will be sent to: <span className="font-semibold">{email}</span>
            </div>
            <Button
              onClick={handleSendEmail}
              disabled={emailSent}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {emailSent ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Email Sent
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>

          {emailSent && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">
                Acknowledgement email sent successfully to <span className="font-semibold">{email}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

