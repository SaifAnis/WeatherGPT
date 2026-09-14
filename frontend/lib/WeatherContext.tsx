"use client";

import React, { createContext, useContext, useState } from "react";

export type Location = {
  id: string;
  name: string;
  country: string;
  coords: [number, number];
};

export const LOCATIONS: Location[] = [
  { id: "delhi", name: "New Delhi", country: "IN", coords: [28.6139, 77.209] },
  { id: "mumbai", name: "Mumbai", country: "IN", coords: [19.076, 72.8777] },
  { id: "blr", name: "Bengaluru", country: "IN", coords: [12.9716, 77.5946] },
  { id: "chennai", name: "Chennai", country: "IN", coords: [13.0827, 80.2707] },
  { id: "kolkata", name: "Kolkata", country: "IN", coords: [22.5726, 88.3639] },
];

export const LANGUAGES = [
  { id: "en", label: "EN" },
  { id: "hi", label: "HI" },
  { id: "ta", label: "TA" },
  { id: "te", label: "TE" },
  { id: "kn", label: "KN" },
];

type WeatherContextType = {
  location: Location;
  setLocation: (loc: Location) => void;
  language: typeof LANGUAGES[0];
  setLanguage: (lang: typeof LANGUAGES[0]) => void;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location>(LOCATIONS[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);

  return (
    <WeatherContext.Provider
      value={{ location, setLocation, language, setLanguage }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within WeatherProvider");
  }
  return context;
}
