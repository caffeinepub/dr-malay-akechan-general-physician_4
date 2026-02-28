import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Loader2 } from 'lucide-react';
import { useGetHeroSettings, useUpdateHeroSettings } from '../../hooks/useQueries';
import { HeroSettings } from '../../backend';

interface HeroSettingsEditorProps {
  sessionToken: string;
}

const defaultSettings: HeroSettings = {
  particleCount: BigInt(70),
  particleSpeed: 1.5,
  particleSize: 2.5,
  particleColor: '#00d9ff',
  showConnectionLines: true,
  mouseInteraction: true,
  backgroundEffect: 'gradient',
  glassmorphismEnabled: false,
  heroGradientStart: '#0a0e27',
  heroGradientEnd: '#0f1729',
};

export default function HeroSettingsEditor({ sessionToken }: HeroSettingsEditorProps) {
  const { data: heroSettings, isLoading } = useGetHeroSettings();
  const updateMutation = useUpdateHeroSettings();

  const [settings, setSettings] = useState<HeroSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (heroSettings) setSettings(heroSettings);
  }, [heroSettings]);

  const handleSave = async () => {
    await updateMutation.mutateAsync({ settings, sessionToken });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 text-slate-400 py-8">
        <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
        <span className="font-body text-sm">Loading settings...</span>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 rounded-sharp tech-input text-sm";
  const labelClass = "block text-xs font-medium font-body text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6">
      {/* Particle Settings */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-4 pb-2 border-b border-slate-700/50">
          Particle Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Particle Count: {settings.particleCount.toString()}
            </label>
            <input
              type="range"
              min={10}
              max={200}
              value={Number(settings.particleCount)}
              onChange={(e) => setSettings({ ...settings, particleCount: BigInt(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>
          <div>
            <label className={labelClass}>
              Particle Speed: {settings.particleSpeed.toFixed(1)}
            </label>
            <input
              type="range"
              min={0.1}
              max={5}
              step={0.1}
              value={settings.particleSpeed}
              onChange={(e) => setSettings({ ...settings, particleSpeed: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>
          <div>
            <label className={labelClass}>
              Particle Size: {settings.particleSize.toFixed(1)}
            </label>
            <input
              type="range"
              min={0.5}
              max={8}
              step={0.5}
              value={settings.particleSize}
              onChange={(e) => setSettings({ ...settings, particleSize: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>
          <div>
            <label className={labelClass}>Particle Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.particleColor}
                onChange={(e) => setSettings({ ...settings, particleColor: e.target.value })}
                className="w-10 h-10 rounded-sharp border border-slate-600 bg-navy-800 cursor-pointer"
              />
              <input
                type="text"
                value={settings.particleColor}
                onChange={(e) => setSettings({ ...settings, particleColor: e.target.value })}
                className={`flex-1 ${inputClass}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Settings */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-4 pb-2 border-b border-slate-700/50">
          Background Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Background Effect</label>
            <select
              value={settings.backgroundEffect}
              onChange={(e) => setSettings({ ...settings, backgroundEffect: e.target.value })}
              className={inputClass}
            >
              <option value="gradient">Gradient</option>
              <option value="aurora">Aurora</option>
              <option value="mesh">Mesh</option>
              <option value="none">None</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Gradient Start</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.heroGradientStart}
                onChange={(e) => setSettings({ ...settings, heroGradientStart: e.target.value })}
                className="w-10 h-10 rounded-sharp border border-slate-600 bg-navy-800 cursor-pointer"
              />
              <input
                type="text"
                value={settings.heroGradientStart}
                onChange={(e) => setSettings({ ...settings, heroGradientStart: e.target.value })}
                className={`flex-1 ${inputClass}`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Gradient End</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.heroGradientEnd}
                onChange={(e) => setSettings({ ...settings, heroGradientEnd: e.target.value })}
                className="w-10 h-10 rounded-sharp border border-slate-600 bg-navy-800 cursor-pointer"
              />
              <input
                type="text"
                value={settings.heroGradientEnd}
                onChange={(e) => setSettings({ ...settings, heroGradientEnd: e.target.value })}
                className={`flex-1 ${inputClass}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-4 pb-2 border-b border-slate-700/50">
          Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'showConnectionLines', label: 'Connection Lines' },
            { key: 'mouseInteraction', label: 'Mouse Interaction' },
            { key: 'glassmorphismEnabled', label: 'Glassmorphism' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings[key as keyof HeroSettings] as boolean}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-pill border transition-all duration-200 ${
                  settings[key as keyof HeroSettings]
                    ? 'bg-cyan-500/30 border-cyan-500'
                    : 'bg-navy-800 border-slate-600'
                }`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-all duration-200 mt-0.5 ${
                    settings[key as keyof HeroSettings] ? 'ml-5 bg-cyan-400' : 'ml-0.5'
                  }`} />
                </div>
              </div>
              <span className="text-sm font-body text-slate-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-sharp bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-navy-800 font-display font-semibold text-sm transition-all duration-200 glow-cyan-sm"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-sharp border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-white font-display font-semibold text-sm transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
