"use client";

import React, { useState } from "react";
import { Cloud, CloudLightning, CloudSun, Sun, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_FORECAST = [
  { day: "Mon", temp: "29°", icon: Cloud, details: "Partly cloudy, light breeze." },
  { day: "Tue", temp: "31°", icon: CloudSun, details: "Sunny intervals." },
  { day: "Wed", temp: "32°", icon: Sun, details: "Clear skies and hot." },
  { day: "Thu", temp: "30°", icon: CloudLightning, details: "Scattered thunderstorms." },
  { day: "Fri", temp: "28°", icon: Cloud, details: "Overcast with mild temperatures." },
];

export function ForecastSection({ className }: { className?: string }) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "bg-[var(--panel-bg)] border border-[var(--panel-border)] backdrop-blur-xl rounded-3xl p-6 text-[var(--foreground)] shadow-2xl transition-all duration-300",
        className
      )}
    >
      <div className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-6 flex items-center justify-between">
        <span>5-Day Forecast</span>
        <span className="text-[10px] bg-[var(--foreground)]/10 text-[var(--foreground)] px-2 py-0.5 rounded-full">DEMO</span>
      </div>
      
      <div className="flex flex-col gap-2">
        {DEMO_FORECAST.map((item, i) => {
          const Icon = item.icon;
          const isSelected = selectedDay === i;
          
          return (
            <div key={i} className="flex flex-col">
              <button
                onClick={() => setSelectedDay(isSelected ? null : i)}
                className={cn(
                  "flex items-center justify-between py-3 px-4 rounded-xl transition-colors w-full",
                  isSelected ? "bg-[var(--foreground)]/10" : "hover:bg-[var(--foreground)]/5"
                )}
              >
                <div className="w-12 text-left font-medium">{item.day}</div>
                <div className="flex-1 flex justify-center">
                  <Icon className="w-6 h-6 text-[var(--accent-blue)]" />
                </div>
                <div className="w-12 text-right font-semibold text-lg">{item.temp}</div>
              </button>
              
              {isSelected && (
                <div className="bg-[var(--foreground)]/5 p-4 rounded-xl mt-1 mb-2 text-sm flex gap-2 items-start border border-[var(--panel-border)] mx-2">
                  <Info className="w-4 h-4 text-[var(--accent-green)] shrink-0 mt-0.5" />
                  <span className="opacity-90">{item.details}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
