"use client";

import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useWeather, LOCATIONS } from "@/lib/WeatherContext";

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const { location } = useWeather();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const isDark = resolvedTheme === "dark" || theme === "dark";

    const baseColor: [number, number, number] = isDark ? [0.1, 0.1, 0.15] : [0.9, 0.95, 1];
    const glowColor: [number, number, number] = isDark ? [0.05, 0.05, 0.1] : [0.8, 0.9, 1];
    const markerColor: [number, number, number] = isDark ? [0.2, 0.8, 1] : [0.05, 0.4, 0.8];
    const darkScale = isDark ? 1 : 0; // 0 for light, 1 for dark

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: darkScale,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor,
      markerColor,
      glowColor,
      markers: LOCATIONS.map((loc) => ({
        location: loc.coords,
        size: loc.id === location.id ? 0.08 : 0.04,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // @ts-expect-error - onRender type is missing in cobe's type definitions
      onRender: (state: Record<string, any>) => {
        state.phi = phi;
        phi += 0.002;
        state.width = width * 2;
        state.height = width * 2;
        
        // Optional: Smoothly center on the active location could be complex with manual phi/theta math.
        // For this milestone, we just auto-rotate and highlight the active marker with a larger size.
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [mounted, theme, resolvedTheme, location]);

  return (
    <div className="relative w-full aspect-square max-w-[800px] mx-auto opacity-90 flex justify-center items-center transition-opacity duration-500">
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          cursor: "grab",
        }}
      />
    </div>
  );
}
