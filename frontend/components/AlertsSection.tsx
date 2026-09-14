"use client";

import { useState } from "react";
import { AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_ALERTS = [
  {
    title: "Heavy Rainfall Warning",
    description: "Expected 50mm rain in the next 3 hours. Avoid low-lying areas.",
    severity: "high",
    time: "10 mins ago",
    details: "The India Meteorological Department has issued a red alert for the surrounding coastal regions. Commuters are advised to stay indoors unless absolutely necessary. Emergency services are on standby."
  }
];

export function AlertsSection({ className }: { className?: string }) {
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider flex items-center justify-between px-2">
        <span>Active Alerts</span>
        <span className="text-[10px] bg-[var(--foreground)]/10 px-2 py-0.5 rounded-full">DEMO</span>
      </div>
      
      {DEMO_ALERTS.map((alert, i) => (
        <div key={i} className="relative">
          <button
            onClick={() => setSelectedAlert(i)}
            className="w-full text-left bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors backdrop-blur-md rounded-2xl p-5 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 group-hover:w-2 transition-all" />
            <div className="flex gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-500 dark:text-red-400 text-lg tracking-tight">{alert.title}</h3>
                <p className="text-red-600/80 dark:text-red-200/80 text-sm mt-1 leading-relaxed pr-4">
                  {alert.description}
                </p>
                <div className="text-red-500/60 dark:text-red-300/50 text-xs mt-3 font-medium">{alert.time}</div>
              </div>
            </div>
          </button>

          {selectedAlert === i && (
            <div className="absolute top-0 left-0 w-full h-full z-10">
              <div className="bg-[var(--background)] border border-red-500/30 rounded-2xl p-6 shadow-2xl h-full flex flex-col relative">
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 mb-4 text-red-500">
                  <Info className="w-5 h-5" />
                  <span className="font-bold">Alert Details</span>
                </div>
                <p className="text-[var(--foreground)] text-sm leading-relaxed overflow-y-auto pr-2">
                  {alert.details}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
