import React, { useState, useEffect, useRef } from 'react';
import { useGetHeroSettings, useUpdateHeroSettings } from '../../hooks/useQueries';
import { IdleHeroSettings, Variant_normal } from '../../backend';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Check, Palette, Layers, Type, Sparkles, MousePointer, Zap } from 'lucide-react';

interface Props {
  sessionToken: string;
}

const PARTICLE_PRESETS = [
  { name: 'None', emoji: '⬜', desc: 'No particles' },
  { name: 'Floating Dots', emoji: '🔵', desc: 'Drifting circles' },
  { name: 'Stars', emoji: '⭐', desc: 'Twinkling stars' },
  { name: 'Snow', emoji: '❄️', desc: 'Falling snowflakes' },
  { name: 'Bubbles', emoji: '🫧', desc: 'Rising bubbles' },
  { name: 'Geometric Shapes', emoji: '🔷', desc: 'Rotating shapes' },
  { name: 'DNA Helix', emoji: '🧬', desc: 'Double helix' },
  { name: 'Medical Pulse', emoji: '➕', desc: 'Pulsing crosses' },
  { name: 'Confetti', emoji: '🎊', desc: 'Falling confetti' },
  { name: 'Fireflies', emoji: '✨', desc: 'Glowing fireflies' },
  { name: 'Network', emoji: '🕸️', desc: 'Connected nodes' },
];

const DEFAULT_SETTINGS: IdleHeroSettings = {
  _version: BigInt(1),
  bgGradientStart: '#0a0f1e',
  bgGradientEnd: '#0d1f3c',
  overlayOpacity: 0.95,
  textColor: '#ffffff',
  backgroundBlur: true,
  glassmorphismIntensity: 0.7,
  heroHeight: Variant_normal.normal,
  animationSpeed: 1.0,
  mouseParallaxEnabled: true,
  particlePreset: 'Floating Dots',
  particleCount: BigInt(120),
  particleMinSize: 0.15,
  particleMaxSize: 2.8,
  particleSpeed: 1.2,
  particleColor: '#38F9D7',
  particleOpacity: 0.85,
};

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
      <span className="text-cyan-400">{icon}</span>
      <h3 className="text-sm font-semibold font-heading text-white/90 uppercase tracking-wider">{title}</h3>
    </div>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <Label className="text-xs text-white/60 min-w-[130px]">{label}</Label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function HeroSettingsEditor({ sessionToken }: Props) {
  const { data: heroSettings, isLoading } = useGetHeroSettings();
  const updateMutation = useUpdateHeroSettings();

  const [form, setForm] = useState<IdleHeroSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (heroSettings) {
      setForm(heroSettings);
    }
  }, [heroSettings]);

  const set = <K extends keyof IdleHeroSettings>(key: K, value: IdleHeroSettings[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ settings: form, sessionToken });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  // Live preview styles
  const previewStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${form.bgGradientStart}, ${form.bgGradientEnd})`,
    position: 'relative',
    overflow: 'hidden',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `rgba(0,0,0,${form.overlayOpacity * 0.5})`,
    backdropFilter: form.backgroundBlur ? 'blur(2px)' : 'none',
  };

  const glassStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `rgba(255,255,255,${form.glassmorphismIntensity * 0.05})`,
  };

  return (
    <div className="space-y-6">
      {/* Live Preview */}
      <div>
        <SectionHeader icon={<Palette className="w-4 h-4" />} title="Live Preview" />
        <div
          className="w-full h-28 rounded-xl border border-white/10 overflow-hidden relative"
          style={previewStyle}
        >
          <div style={overlayStyle} />
          <div style={glassStyle} />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-1">
            <div
              className="text-sm font-bold font-heading"
              style={{ color: form.textColor }}
            >
              Hero Preview
            </div>
            <div className="text-xs opacity-60" style={{ color: form.textColor }}>
              {form.particlePreset} · {form.heroHeight}
            </div>
          </div>
          {/* Particle dots preview */}
          {form.particlePreset !== 'None' && (
            <div className="absolute inset-0 z-5 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    width: `${form.particleMaxSize * 2}px`,
                    height: `${form.particleMaxSize * 2}px`,
                    left: `${(i * 8.3) % 100}%`,
                    top: `${(i * 13.7) % 100}%`,
                    background: form.particleColor,
                    opacity: form.particleOpacity * 0.8,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Background */}
      <div>
        <SectionHeader icon={<Layers className="w-4 h-4" />} title="Background" />
        <div className="space-y-3">
          <ControlRow label="Gradient Start">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.bgGradientStart}
                onChange={e => set('bgGradientStart', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-white/20 bg-transparent"
              />
              <span className="text-xs text-white/50 font-mono">{form.bgGradientStart}</span>
            </div>
          </ControlRow>
          <ControlRow label="Gradient End">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.bgGradientEnd}
                onChange={e => set('bgGradientEnd', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-white/20 bg-transparent"
              />
              <span className="text-xs text-white/50 font-mono">{form.bgGradientEnd}</span>
            </div>
          </ControlRow>
          <ControlRow label="Overlay Opacity">
            <div className="flex items-center gap-3">
              <Slider
                min={0} max={100} step={1}
                value={[Math.round(form.overlayOpacity * 100)]}
                onValueChange={([v]) => set('overlayOpacity', v / 100)}
                className="flex-1"
              />
              <span className="text-xs text-white/50 w-8 text-right">{Math.round(form.overlayOpacity * 100)}%</span>
            </div>
          </ControlRow>
          <ControlRow label="Glassmorphism">
            <div className="flex items-center gap-3">
              <Slider
                min={0} max={100} step={1}
                value={[Math.round(form.glassmorphismIntensity * 100)]}
                onValueChange={([v]) => set('glassmorphismIntensity', v / 100)}
                className="flex-1"
              />
              <span className="text-xs text-white/50 w-8 text-right">{Math.round(form.glassmorphismIntensity * 100)}%</span>
            </div>
          </ControlRow>
          <ControlRow label="Background Blur">
            <Switch
              checked={form.backgroundBlur}
              onCheckedChange={v => set('backgroundBlur', v)}
            />
          </ControlRow>
        </div>
      </div>

      {/* Text */}
      <div>
        <SectionHeader icon={<Type className="w-4 h-4" />} title="Text & Colors" />
        <div className="space-y-3">
          <ControlRow label="Text Color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.textColor}
                onChange={e => set('textColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-white/20 bg-transparent"
              />
              <span className="text-xs text-white/50 font-mono">{form.textColor}</span>
            </div>
          </ControlRow>
        </div>
      </div>

      {/* Effects */}
      <div>
        <SectionHeader icon={<Zap className="w-4 h-4" />} title="Effects & Animation" />
        <div className="space-y-3">
          <ControlRow label="Animation Speed">
            <div className="flex items-center gap-3">
              <Slider
                min={0} max={100} step={1}
                value={[Math.round(form.animationSpeed * 10)]}
                onValueChange={([v]) => set('animationSpeed', v / 10)}
                className="flex-1"
              />
              <span className="text-xs text-white/50 w-8 text-right">{form.animationSpeed.toFixed(1)}x</span>
            </div>
          </ControlRow>
          <ControlRow label="Mouse Parallax">
            <Switch
              checked={form.mouseParallaxEnabled}
              onCheckedChange={v => set('mouseParallaxEnabled', v)}
            />
          </ControlRow>
        </div>
      </div>

      {/* Particles */}
      <div>
        <SectionHeader icon={<Sparkles className="w-4 h-4" />} title="Particle Effects" />

        {/* Preset Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
          {PARTICLE_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => set('particlePreset', preset.name)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all duration-150 ${
                form.particlePreset === preset.name
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white/80'
              }`}
            >
              <span className="text-xl">{preset.emoji}</span>
              <span className="text-[10px] font-medium leading-tight">{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Fine-tuning */}
        {form.particlePreset !== 'None' && (
          <div className="space-y-3 mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wider font-heading mb-3">Fine-tuning</p>

            <ControlRow label="Particle Count">
              <div className="flex items-center gap-3">
                <Slider
                  min={10} max={500} step={5}
                  value={[Number(form.particleCount)]}
                  onValueChange={([v]) => set('particleCount', BigInt(v))}
                  className="flex-1"
                />
                <span className="text-xs text-white/50 w-10 text-right">{Number(form.particleCount)}</span>
              </div>
            </ControlRow>

            <ControlRow label="Min Size (px)">
              <div className="flex items-center gap-3">
                <Slider
                  min={0.1} max={20} step={0.1}
                  value={[form.particleMinSize]}
                  onValueChange={([v]) => set('particleMinSize', v)}
                  className="flex-1"
                />
                <span className="text-xs text-white/50 w-10 text-right">{form.particleMinSize.toFixed(1)}</span>
              </div>
            </ControlRow>

            <ControlRow label="Max Size (px)">
              <div className="flex items-center gap-3">
                <Slider
                  min={0.5} max={50} step={0.5}
                  value={[form.particleMaxSize]}
                  onValueChange={([v]) => set('particleMaxSize', v)}
                  className="flex-1"
                />
                <span className="text-xs text-white/50 w-10 text-right">{form.particleMaxSize.toFixed(1)}</span>
              </div>
            </ControlRow>

            <ControlRow label="Speed">
              <div className="flex items-center gap-3">
                <Slider
                  min={0.1} max={10} step={0.1}
                  value={[form.particleSpeed]}
                  onValueChange={([v]) => set('particleSpeed', v)}
                  className="flex-1"
                />
                <span className="text-xs text-white/50 w-10 text-right">{form.particleSpeed.toFixed(1)}</span>
              </div>
            </ControlRow>

            <ControlRow label="Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.particleColor}
                  onChange={e => set('particleColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-white/20 bg-transparent"
                />
                <span className="text-xs text-white/50 font-mono">{form.particleColor}</span>
              </div>
            </ControlRow>

            <ControlRow label="Opacity">
              <div className="flex items-center gap-3">
                <Slider
                  min={0} max={100} step={1}
                  value={[Math.round(form.particleOpacity * 100)]}
                  onValueChange={([v]) => set('particleOpacity', v / 100)}
                  className="flex-1"
                />
                <span className="text-xs text-white/50 w-8 text-right">{Math.round(form.particleOpacity * 100)}%</span>
              </div>
            </ControlRow>
          </div>
        )}
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={updateMutation.isPending}
        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-heading"
      >
        {updateMutation.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
        ) : saved ? (
          <><Check className="w-4 h-4 mr-2" /> Saved!</>
        ) : (
          'Save Hero Settings'
        )}
      </Button>
    </div>
  );
}
