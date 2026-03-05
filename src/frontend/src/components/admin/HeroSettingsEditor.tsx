import { Loader2, Save } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  useGetHeroSettings,
  useUpdateHeroSettings,
} from "../../hooks/useQueries";

interface HeroSettingsEditorProps {
  sessionToken: string;
}

const DEFAULT_GLOW = {
  enabled: true,
  intensity: 5,
  color: "#0ea5e9",
  style: "soft",
};

const DEFAULT_FOOTER_GLOW = {
  enabled: false,
  intensity: 3,
  color: "#FF6399",
  style: "shimmer",
};

export default function HeroSettingsEditor({
  sessionToken,
}: HeroSettingsEditorProps) {
  const { data: heroSettings, isLoading } = useGetHeroSettings();
  const updateHeroSettings = useUpdateHeroSettings();

  const [localSettings, setLocalSettings] = useState({
    particleCount: 70,
    particleSpeed: 1.5,
    particleSize: 2.5,
    particleColor: "#90EE90",
    showConnectionLines: true,
    mouseInteraction: true,
    backgroundEffect: "gradient",
    glassmorphismEnabled: true,
    heroGradientStart: "#40A1FF",
    heroGradientEnd: "#A993FF",
  });

  const [heroGlow, setHeroGlow] = useState(DEFAULT_GLOW);
  const [footerGlow, setFooterGlow] = useState(DEFAULT_FOOTER_GLOW);

  useEffect(() => {
    if (heroSettings) {
      setLocalSettings({
        particleCount: Number(heroSettings.particleCount),
        particleSpeed: heroSettings.particleSpeed,
        particleSize: heroSettings.particleSize,
        particleColor: heroSettings.particleColor,
        showConnectionLines: heroSettings.showConnectionLines,
        mouseInteraction: heroSettings.mouseInteraction,
        backgroundEffect: heroSettings.backgroundEffect,
        glassmorphismEnabled: heroSettings.glassmorphismEnabled,
        heroGradientStart: heroSettings.heroGradientStart,
        heroGradientEnd: heroSettings.heroGradientEnd,
      });
      if (heroSettings.heroGlowEffect) {
        setHeroGlow({
          enabled: heroSettings.heroGlowEffect.enabled,
          intensity: Number(heroSettings.heroGlowEffect.intensity),
          color: heroSettings.heroGlowEffect.color,
          style: heroSettings.heroGlowEffect.style,
        });
      }
      if (heroSettings.footerGlowEffect) {
        setFooterGlow({
          enabled: heroSettings.footerGlowEffect.enabled,
          intensity: Number(heroSettings.footerGlowEffect.intensity),
          color: heroSettings.footerGlowEffect.color,
          style: heroSettings.footerGlowEffect.style,
        });
      }
    }
  }, [heroSettings]);

  const handleSave = async () => {
    await updateHeroSettings.mutateAsync({
      settings: {
        particleCount: BigInt(localSettings.particleCount),
        particleSpeed: localSettings.particleSpeed,
        particleSize: localSettings.particleSize,
        particleColor: localSettings.particleColor,
        showConnectionLines: localSettings.showConnectionLines,
        mouseInteraction: localSettings.mouseInteraction,
        backgroundEffect: localSettings.backgroundEffect,
        glassmorphismEnabled: localSettings.glassmorphismEnabled,
        heroGradientStart: localSettings.heroGradientStart,
        heroGradientEnd: localSettings.heroGradientEnd,
        heroGlowEffect: {
          enabled: heroGlow.enabled,
          intensity: BigInt(heroGlow.intensity),
          color: heroGlow.color,
          style: heroGlow.style,
        },
        footerGlowEffect: {
          enabled: footerGlow.enabled,
          intensity: BigInt(footerGlow.intensity),
          color: footerGlow.color,
          style: footerGlow.style,
        },
      },
      sessionToken,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">
          Hero Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure hero section appearance settings.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        {/* Gradient Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="block text-sm font-medium text-foreground mb-1.5">
              Gradient Start Color
            </p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localSettings.heroGradientStart}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    heroGradientStart: e.target.value,
                  })
                }
                className="w-10 h-10 rounded border border-border cursor-pointer"
              />
              <input
                type="text"
                value={localSettings.heroGradientStart}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    heroGradientStart: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <p className="block text-sm font-medium text-foreground mb-1.5">
              Gradient End Color
            </p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localSettings.heroGradientEnd}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    heroGradientEnd: e.target.value,
                  })
                }
                className="w-10 h-10 rounded border border-border cursor-pointer"
              />
              <input
                type="text"
                value={localSettings.heroGradientEnd}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    heroGradientEnd: e.target.value,
                  })
                }
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        {/* Background Effect */}
        <div>
          <p className="block text-sm font-medium text-foreground mb-1.5">
            Background Effect
          </p>
          <select
            value={localSettings.backgroundEffect}
            onChange={(e) =>
              setLocalSettings({
                ...localSettings,
                backgroundEffect: e.target.value,
              })
            }
            className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="gradient">Gradient</option>
            <option value="aurora">Aurora</option>
            <option value="mesh">Mesh</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* Glassmorphism toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-foreground">Glassmorphism</p>
            <p className="text-xs text-muted-foreground">
              Enable glass card effects
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setLocalSettings({
                ...localSettings,
                glassmorphismEnabled: !localSettings.glassmorphismEnabled,
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              localSettings.glassmorphismEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.glassmorphismEnabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* ── Hero Glow Effect ── */}
        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: heroGlow.enabled ? heroGlow.color : "#d1d5db",
              }}
            />
            Hero Glow Effect
          </h3>
          <div className="space-y-4">
            {/* Enable toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Enable Glow
                </p>
                <p className="text-xs text-muted-foreground">
                  Show ambient light orbs in hero section
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setHeroGlow({ ...heroGlow, enabled: !heroGlow.enabled })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  heroGlow.enabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    heroGlow.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {heroGlow.enabled && (
              <>
                {/* Glow Color */}
                <div>
                  <p className="block text-sm font-medium text-foreground mb-1.5">
                    Glow Color
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={heroGlow.color}
                      onChange={(e) =>
                        setHeroGlow({ ...heroGlow, color: e.target.value })
                      }
                      className="w-10 h-10 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={heroGlow.color}
                      onChange={(e) =>
                        setHeroGlow({ ...heroGlow, color: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* Glow Style */}
                <div>
                  <p className="block text-sm font-medium text-foreground mb-1.5">
                    Glow Style
                  </p>
                  <select
                    value={heroGlow.style}
                    onChange={(e) =>
                      setHeroGlow({ ...heroGlow, style: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="soft">Soft</option>
                    <option value="shimmer">Shimmer</option>
                    <option value="pulse">Pulse</option>
                  </select>
                </div>

                {/* Glow Intensity */}
                <div>
                  <p className="block text-sm font-medium text-foreground mb-1.5">
                    Intensity: {heroGlow.intensity}
                  </p>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={heroGlow.intensity}
                    onChange={(e) =>
                      setHeroGlow({
                        ...heroGlow,
                        intensity: Number(e.target.value),
                      })
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Subtle</span>
                    <span>Intense</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Footer Glow Effect ── */}
        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: footerGlow.enabled ? footerGlow.color : "#d1d5db",
              }}
            />
            Footer Glow Effect
          </h3>
          <div className="space-y-4">
            {/* Enable toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Enable Glow
                </p>
                <p className="text-xs text-muted-foreground">
                  Show ambient light orbs in footer section
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFooterGlow({ ...footerGlow, enabled: !footerGlow.enabled })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  footerGlow.enabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    footerGlow.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {footerGlow.enabled && (
              <>
                {/* Glow Color */}
                <div>
                  <p className="block text-sm font-medium text-foreground mb-1.5">
                    Glow Color
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={footerGlow.color}
                      onChange={(e) =>
                        setFooterGlow({ ...footerGlow, color: e.target.value })
                      }
                      className="w-10 h-10 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={footerGlow.color}
                      onChange={(e) =>
                        setFooterGlow({ ...footerGlow, color: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* Glow Style */}
                <div>
                  <p className="block text-sm font-medium text-foreground mb-1.5">
                    Glow Style
                  </p>
                  <select
                    value={footerGlow.style}
                    onChange={(e) =>
                      setFooterGlow({ ...footerGlow, style: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="soft">Soft</option>
                    <option value="shimmer">Shimmer</option>
                    <option value="pulse">Pulse</option>
                  </select>
                </div>

                {/* Glow Intensity */}
                <div>
                  <p className="block text-sm font-medium text-foreground mb-1.5">
                    Intensity: {footerGlow.intensity}
                  </p>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={footerGlow.intensity}
                    onChange={(e) =>
                      setFooterGlow({
                        ...footerGlow,
                        intensity: Number(e.target.value),
                      })
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Subtle</span>
                    <span>Intense</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={updateHeroSettings.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {updateHeroSettings.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Settings
          </button>
        </div>
        {updateHeroSettings.isSuccess && (
          <p
            className="text-sm text-right"
            style={{ color: "oklch(0.55 0.15 155)" }}
          >
            Saved successfully!
          </p>
        )}
      </div>
    </div>
  );
}
