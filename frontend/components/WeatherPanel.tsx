"use client";

import { CloudRain, Wind, Droplets, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeather } from "@/lib/WeatherContext";

export function WeatherPanel({ className }: { className?: string }) {
  const { location } = useWeather();

  // Simple mock data varying slightly based on location ID length for demo purposes
  const temp = 28 + (location.name.length % 5);
  const humidity = 70 + (location.name.length * 2);
  const feelsLike = temp + 3;

  return (
    <div
      className={cn(
        "bg-[var(--panel-bg)] border border-[var(--panel-border)] backdrop-blur-xl rounded-3xl p-8 text-[var(--foreground)] shadow-2xl transition-all duration-300",
        className
      )}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-light mb-1">{location.name}, {location.country}</h2>
          <p className="text-[var(--text-muted)] text-sm">Demo Data • Today, 9:20 AM</p>
        </div>
        <div className="text-right">
          <div className="text-6xl font-extralight tracking-tighter">{temp}°</div>
          <p className="text-[var(--foreground)] font-medium mt-2 flex items-center justify-end gap-1.5 opacity-90">
            <CloudRain className="w-5 h-5 text-[var(--accent-blue)]" />
            Light Rain
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--foreground)]/5 rounded-2xl p-5 flex flex-col gap-2">
          <div className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-[var(--accent-blue)]" /> Wind
          </div>
          <div className="text-xl font-medium">12 km/h</div>
        </div>
        <div className="bg-[var(--foreground)]/5 rounded-2xl p-5 flex flex-col gap-2">
          <div className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-[var(--accent-blue)]" /> Humidity
          </div>
          <div className="text-xl font-medium">{humidity}%</div>
        </div>
        <div className="bg-[var(--foreground)]/5 rounded-2xl p-5 flex flex-col gap-2">
          <div className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[var(--accent-blue)]" /> Visibility
          </div>
          <div className="text-xl font-medium">4 km</div>
        </div>
        <div className="bg-[var(--foreground)]/5 rounded-2xl p-5 flex flex-col gap-2">
          <div className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider">
            Feels Like
          </div>
          <div className="text-xl font-medium">{feelsLike}°</div>
        </div>
      </div>
    </div>
  );
}
