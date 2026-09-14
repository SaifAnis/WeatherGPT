"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, MapPin, Globe2, Sun, Moon } from "lucide-react";
import { useWeather, LOCATIONS, LANGUAGES } from "@/lib/WeatherContext";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { location, setLocation, language, setLanguage } = useWeather();

  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="relative z-50 flex items-center justify-between p-6 bg-transparent">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-blue)] flex items-center justify-center shadow-lg">
          <Globe2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-semibold tracking-tight text-[var(--foreground)] drop-shadow-md">
          WeatherGPT
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 bg-[var(--panel-bg)] border border-[var(--panel-border)] backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
        {/* Location Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLocationMenu(!showLocationMenu)}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity border-r border-[var(--panel-border)] pr-4"
          >
            <MapPin className="w-4 h-4 text-[var(--accent-blue)]" />
            <span className="text-sm font-medium hidden sm:inline-block">
              {location.name}
            </span>
          </button>

          {showLocationMenu && (
            <div className="absolute top-full mt-2 left-0 bg-[var(--background)] border border-[var(--panel-border)] shadow-xl rounded-xl p-2 min-w-[150px] flex flex-col gap-1">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setLocation(loc);
                    setShowLocationMenu(false);
                  }}
                  className={`text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--panel-bg)] ${
                    location.id === loc.id
                      ? "text-[var(--accent-blue)] font-bold bg-[var(--panel-bg)]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity border-r border-[var(--panel-border)] pr-4"
          >
            <span className="text-sm font-medium">{language.label}</span>
          </button>
          
          {showLangMenu && (
            <div className="absolute top-full mt-2 left-0 bg-[var(--background)] border border-[var(--panel-border)] shadow-xl rounded-xl p-2 min-w-[80px] flex flex-col gap-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLanguage(lang);
                    setShowLangMenu(false);
                  }}
                  className={`text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--panel-bg)] ${
                    language.id === lang.id
                      ? "text-[var(--accent-blue)] font-bold bg-[var(--panel-bg)]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-1.5 rounded-full hover:bg-[var(--panel-bg)] transition-colors text-[var(--foreground)]"
          aria-label="Toggle Dark Mode"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Menu */}
        <button className="p-1.5 rounded-full hover:bg-[var(--panel-bg)] transition-colors text-[var(--foreground)] ml-2 border-l border-[var(--panel-border)] pl-4">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
