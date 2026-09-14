"use client";

import { Globe } from "@/components/Globe";
import { WeatherPanel } from "@/components/WeatherPanel";
import { ForecastSection } from "@/components/ForecastSection";
import { AlertsSection } from "@/components/AlertsSection";
import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] relative overflow-hidden flex flex-col font-sans transition-colors duration-300">
      {/* Background Globe - Takes up the center background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto">
        <Globe />
      </div>

      {/* Radial gradient overlay to darken/lighten edges so text is readable */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--background)_100%)] opacity-80 transition-colors duration-300" />

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row justify-between p-4 sm:p-6 lg:p-8 gap-6 pointer-events-none mt-2 lg:mt-4 overflow-y-auto lg:overflow-visible">
        
        {/* Left Column */}
        <div className="w-full lg:w-[420px] flex flex-col gap-6 pointer-events-auto shrink-0">
          <WeatherPanel />
          <AlertsSection />
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 pointer-events-auto shrink-0 mt-6 lg:mt-0">
          <ForecastSection className="w-full" />
        </div>

      </div>

      {/* Bottom Center Chat Interface */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 pointer-events-none flex justify-center pb-8 mt-auto">
        <div className="w-full max-w-4xl pointer-events-auto">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
