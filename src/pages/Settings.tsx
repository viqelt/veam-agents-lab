import { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Gauge, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Settings() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [units, setUnits] = useState<'kwh' | 'mj'>('kwh');
  const [lang, setLang] = useState('en');
  const [notif, setNotif] = useState({ peak: true, anomaly: true, weekly: false });

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 pt-8 md:pt-12">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">Preferences</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm">Personalize how VEAM Agents Lab feels and behaves.</p>
      </header>

      <div className="space-y-4">
        <Section icon={<Sparkles className="w-4 h-4" />} title="Appearance">
          <Option label="Theme" desc="Switch between dark and light mode.">
            <div className="flex gap-2">
              <ThemeBtn active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<Moon className="w-3.5 h-3.5" />} label="Dark" />
              <ThemeBtn active={theme === 'light'} onClick={() => setTheme('light')} icon={<Sun className="w-3.5 h-3.5" />} label="Light" />
            </div>
          </Option>
        </Section>

        <Section icon={<Gauge className="w-4 h-4" />} title="Units">
          <Option label="Energy unit" desc="Unit used across all charts and forecasts.">
            <div className="flex gap-2">
              <ThemeBtn active={units === 'kwh'} onClick={() => setUnits('kwh')} icon={null} label="kWh" />
              <ThemeBtn active={units === 'mj'} onClick={() => setUnits('mj')} icon={null} label="MJ" />
            </div>
          </Option>
        </Section>

        <Section icon={<Globe className="w-4 h-4" />} title="Language">
          <Option label="Interface language" desc="Choose your preferred language.">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
            </select>
          </Option>
        </Section>

        <Section icon={<Bell className="w-4 h-4" />} title="Notifications">
          <Toggle label="Peak-hour warnings" desc="Get alerted before forecasted peak windows." on={notif.peak} onChange={(v) => setNotif({ ...notif, peak: v })} />
          <Toggle label="Anomaly detection" desc="Notify when an agent shows unusual behavior." on={notif.anomaly} onChange={(v) => setNotif({ ...notif, anomaly: v })} />
          <Toggle label="Weekly digest" desc="Receive a weekly summary of all agents." on={notif.weekly} onChange={(v) => setNotif({ ...notif, weekly: v })} />
        </Section>

        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 p-5">
          <div className="text-xs uppercase tracking-widest text-cyan-300 mb-1">About</div>
          <div className="text-sm font-medium">VEAM Agents Lab · v2.6</div>
          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
            An AI-native energy simulation platform for NILM, load prediction, and behavior modeling research.
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400">{icon}</div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Option({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function ThemeBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition',
        active
          ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/40 text-white'
          : 'bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/10'
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Toggle({ label, desc, on, onChange }: { label: string; desc?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!on)}
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors shrink-0',
          on ? 'bg-gradient-to-r from-cyan-400 to-violet-500' : 'bg-white/10'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
            on && 'translate-x-4'
          )}
        />
      </button>
    </div>
  );
}