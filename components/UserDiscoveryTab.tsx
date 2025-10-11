"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, XCircle } from "lucide-react";
import { DiscoveryFlow } from "@/components/DiscoveryFlow";

export function UserDiscoveryTab() {
  const [email, setEmail] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDiscover = () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }

    setError(null);
    setHasStarted(true);
  };

  const handleReset = () => {
    setEmail("");
    setHasStarted(false);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Email Input Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter data subject email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !hasStarted && handleDiscover()}
              disabled={hasStarted}
              className="h-12 text-base"
            />
          </div>
          {!hasStarted ? (
            <Button
              onClick={handleDiscover}
              disabled={!email}
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Search className="mr-2 h-5 w-5" />
              Discover
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-12 px-8"
            >
              Reset
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Use the reusable DiscoveryFlow component */}
      {hasStarted && <DiscoveryFlow email={email} autoStart={true} />}
    </div>
  );
}
