import { useState, useMemo } from 'react';
import { agents, generateForecast, generateInsights, Agent } from '@/data/agents';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Line, ComposedChart, ReferenceLine } from 'recharts';
import { AlertTriangle, TrendingUp, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Prediction() {
  const [selectedId, setSelectedId] = useState(agents[1].id);
  const selected: Agent = agents.find((a) => a.id === selectedId)!;

  const forecast = useMemo(() => generateForecast(selected), [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps
  const insights = useMemo(() => generateInsights(selected), [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps
  const peak = forecast.reduce((a, b) => (b.predicted > a.predicted ? b : a));
  const confidence = Math.max(60, Math.min(98, 95 - selected.variability / 3));

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 md:pt-12">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">Forecast</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Prediction View</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-2xl">
          See tomorrow's consumption with confidence bands, peak-hour warnings, and optimization tips.
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

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium">Next 24-hour forecast</div>
                <div className="text-xs text-muted-foreground mt-0.5">{selected.predictionProfile}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Confidence</div>
                  <div className="text-sm font-semibold text-emerald-400">{confidence.toFixed(0)}%</div>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecast}>
                  <defs>
                    <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0D1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confBand)" />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="#07080F" />
                  <Line type="monotone" dataKey="predicted" stroke="#22d3ee" strokeWidth={2.5} dot={false} />
                  <ReferenceLine x={peak.hour} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: `Peak ${peak.predicted}kW`, fill: '#f59e0b', fontSize: 10, position: 'top' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Expected" value={`${selected.avgConsumption.toFixed(1)} kWh`} color="text-cyan-400" />
            <StatCard icon={<Target className="w-4 h-4" />} label="Confidence" value={`${confidence.toFixed(0)}%`} color="text-emerald-400" />
            <StatCard icon={<AlertTriangle className="w-4 h-4" />} label="Peak hour" value={`${peak.hour}:00`} color="text-amber-400" />
            <StatCard icon={<Sparkles className="w-4 h-4" />} label="Peak load" value={`${peak.predicted.toFixed(2)} kW`} color="text-violet-400" />
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-amber-200">Peak-hour warning</div>
              <div className="text-xs text-amber-100/70 leading-relaxed mt-1">
                Consumption is expected to peak at <strong>{peak.hour}:00</strong> with an estimated load of
                {' '}<strong>{peak.predicted.toFixed(2)} kW</strong>. Pre-shift flexible loads (laundry, EV charging)
                to off-peak windows between 01:00 and 05:00 to flatten the curve.
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5">
            <div className="text-sm font-medium mb-3">Trend explanation</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selected.name} shows a <strong className="text-white">{selected.behaviorLabel.toLowerCase()}</strong> pattern
              with {selected.variability}% variability. The model is {confidence.toFixed(0)}% confident in tomorrow's
              shape based on historical signatures.
            </p>
          </div>

          {insights.slice(2).map((ins) => (
            <div key={ins.id} className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn(
                  'text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded',
                  ins.type === 'warning' && 'bg-red-500/10 text-red-400',
                  ins.type === 'tip' && 'bg-cyan-500/10 text-cyan-400',
                  ins.type === 'prediction' && 'bg-violet-500/10 text-violet-400',
                  ins.type === 'optimization' && 'bg-emerald-500/10 text-emerald-400',
                )}>{ins.type}</span>
                <span className="text-xs font-medium">{ins.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{ins.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-card/40 p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-widest mb-1">
        {icon}
        {label}
      </div>
      <div className={cn('text-lg font-semibold', color)}>{value}</div>
    </div>
  );
}