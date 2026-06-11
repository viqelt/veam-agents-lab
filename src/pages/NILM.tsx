import { useState, useMemo } from 'react';
import { agents, generateAppliances, generateHourlySeries } from '@/data/agents';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, AreaChart, Area } from 'recharts';
import { Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NILM() {
  const [selectedId, setSelectedId] = useState(agents[8].id);
  const selected = agents.find((a) => a.id === selectedId)!;

  const appliances = useMemo(() => generateAppliances(selected), [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps
  const totalLoad = useMemo(() => generateHourlySeries(selected), [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const timelineData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => {
      const row: Record<string, unknown> = { hour: h };
      appliances.forEach((app) => {
        row[app.name] = app.activeHours.includes(h) ? app.avgLoad : 0;
      });
      return row;
    });
    return hours;
  }, [appliances]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 md:pt-12">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">NILM Analysis</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Appliance Disaggregation</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-2xl">
          Non-Intrusive Load Monitoring estimates what appliances drive the total load, from a single meter reading.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {agents.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedId(a.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5',
              a.id === selectedId
                ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/40 text-white'
                : 'bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
            )}
          >
            <span>{a.icon}</span>
            <span>{a.name}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium">Aggregate load (24h)</div>
              <div className="text-xs text-muted-foreground mt-0.5">Raw meter signal</div>
            </div>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={totalLoad}>
                <defs>
                  <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0D1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="kw" stroke="#22d3ee" strokeWidth={2} fill="url(#total)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium">Disaggregated appliances</div>
              <div className="text-xs text-muted-foreground mt-0.5">Confidence per detected device</div>
            </div>
            <Cpu className="w-4 h-4 text-violet-400" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appliances} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 1]} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={90} />
                <Tooltip
                  contentStyle={{ background: '#0D1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${(v * 100).toFixed(0)}%`, 'Confidence']}
                />
                <Bar dataKey="confidence" radius={[4, 4, 4, 4]}>
                  {appliances.map((a) => (
                    <Cell key={a.id} fill={a.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium">Device activation timeline</div>
            <div className="text-xs text-muted-foreground mt-0.5">Stacked hourly signatures across 24 hours</div>
          </div>
        </div>
        <div className="space-y-2">
          {appliances.map((app) => (
            <div key={app.id} className="flex items-center gap-3">
              <div className="w-32 shrink-0 flex items-center gap-2">
                <span className="text-lg">{app.icon}</span>
                <div>
                  <div className="text-xs font-medium">{app.name}</div>
                  <div className="text-[10px] text-muted-foreground">{(app.confidence * 100).toFixed(0)}% · {app.avgLoad}kW</div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-24 gap-0.5">
                {Array.from({ length: 24 }).map((_, h) => {
                  const active = app.activeHours.includes(h);
                  return (
                    <div
                      key={h}
                      className={cn('h-6 rounded', active ? '' : 'bg-white/[0.03]')}
                      style={active ? { background: app.color, opacity: 0.8 } : {}}
                      title={`${h}:00`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-32" />
            <div className="flex-1 grid grid-cols-24 text-[9px] text-muted-foreground">
              {[0, 6, 12, 18, 23].map((h) => (
                <div key={h} style={{ gridColumn: h + 1 }}>
                  {h.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <div className="text-sm font-medium mb-2 text-cyan-200">What the system detects</div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          For <strong className="text-white">{selected.name}</strong>, the NILM engine identifies{' '}
          <strong className="text-white">{appliances.length} appliances</strong> from the aggregate signal.
          {' '}Refrigerator cycling is detected almost continuously (≈{(appliances[0].confidence * 100).toFixed(0)}% confidence),
          while HVAC activity clusters between 18:00–21:00 matching the evening peak.
          {' '}Low-confidence signatures such as EV charging suggest occasional overnight usage.
        </p>
      </div>

      <style>{`
        .grid-cols-24 { grid-template-columns: repeat(24, minmax(0, 1fr)); }
      `}</style>
    </div>
  );
}