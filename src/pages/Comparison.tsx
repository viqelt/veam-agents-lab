import { useState, useMemo } from 'react';
import { agents, generateHourlySeries } from '@/data/agents';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, Cell } from 'recharts';
import { Trophy, TrendingDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['#22d3ee', '#8b5cf6', '#34d399', '#f472b6'];

export default function Comparison() {
  const [selected, setSelected] = useState<string[]>([agents[4].id, agents[5].id, agents[1].id]);

  const toggle = (id: string) => {
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < 4 ? [...cur, id] : cur
    );
  };

  const picked = agents.filter((a) => selected.includes(a.id));

  const radarData = useMemo(() => {
    const metrics = ['Efficiency', 'Stability', 'Low Peak', 'Low Anomaly', 'Consistency'];
    return metrics.map((metric) => {
      const row: Record<string, unknown> = { metric };
      picked.forEach((a) => {
        let v = 0;
        if (metric === 'Efficiency') v = a.efficiencyScore;
        else if (metric === 'Stability') v = 100 - a.variability;
        else if (metric === 'Low Peak') v = Math.max(0, 100 - a.avgConsumption * 2.5);
        else if (metric === 'Low Anomaly') v = 100 - a.anomalyRisk;
        else if (metric === 'Consistency') v = 100 - a.variability * 0.9;
        row[a.name] = Math.max(0, Math.min(100, v));
      });
      return row;
    });
  }, [picked]);

  const loadData = useMemo(() => {
    const result: Record<string, unknown>[] = [];
    const seriesMap = new Map<string, { hour: number; kw: number }[]>();
    picked.forEach((a) => seriesMap.set(a.id, generateHourlySeries(a)));
    for (let h = 0; h < 24; h++) {
      const row: Record<string, unknown> = { hour: h };
      picked.forEach((a) => (row[a.name] = seriesMap.get(a.id)![h].kw));
      result.push(row);
    }
    return result;
  }, [picked]);

  const efficiencyData = picked.map((a) => ({ name: a.name, value: a.efficiencyScore }));
  const best = picked.reduce((a, b) => (a.efficiencyScore >= b.efficiencyScore ? a : b), picked[0]);
  const worst = picked.reduce((a, b) => (a.efficiencyScore <= b.efficiencyScore ? a : b), picked[0]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 md:pt-12">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">Benchmark</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Compare Agents</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-2xl">
          Put up to 4 agents side by side across efficiency, peaks, stability, and anomaly probability.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {agents.map((a) => {
          const on = selected.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              disabled={!on && selected.length >= 4}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5',
                on
                  ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/40 text-white'
                  : 'bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10',
                !on && selected.length >= 4 && 'opacity-40 cursor-not-allowed'
              )}
            >
              <span>{a.icon}</span>
              <span>{a.name}</span>
              {on && <Check className="w-3 h-3" />}
            </button>
          );
        })}
      </div>

      {picked.length >= 2 && (
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-emerald-300">Best profile</div>
              <div className="text-sm font-semibold">{best.name} · {best.efficiencyScore}/100</div>
            </div>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
            <TrendingDown className="w-6 h-6 text-red-400" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-red-300">Needs improvement</div>
              <div className="text-sm font-semibold">{worst.name} · {worst.efficiencyScore}/100</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5">
          <div className="text-sm font-medium mb-3">Multi-dimensional radar</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.1)" tick={false} />
                {picked.map((a, i) => (
                  <Radar
                    key={a.id}
                    name={a.name}
                    dataKey={a.name}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={0.2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5">
          <div className="text-sm font-medium mb-3">24-hour load overlap</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loadData}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0D1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {picked.map((a, i) => (
                  <Line key={a.id} type="monotone" dataKey={a.name} stroke={COLORS[i]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5 lg:col-span-2">
          <div className="text-sm font-medium mb-3">Efficiency ranking</div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#0D1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {efficiencyData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5 lg:col-span-2 overflow-x-auto">
          <div className="text-sm font-medium mb-3">Metric matrix</div>
          <table className="w-full text-xs min-w-[560px]">
            <thead>
              <tr className="text-left text-muted-foreground text-[10px] uppercase tracking-widest">
                <th className="py-2 font-medium">Agent</th>
                <th className="py-2 font-medium">Avg kWh</th>
                <th className="py-2 font-medium">Variability</th>
                <th className="py-2 font-medium">Efficiency</th>
                <th className="py-2 font-medium">Anomaly</th>
                <th className="py-2 font-medium">Profile</th>
              </tr>
            </thead>
            <tbody>
              {picked.map((a, i) => (
                <tr key={a.id} className="border-t border-white/5">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-lg">{a.icon}</span>
                      <span className="font-medium">{a.name}</span>
                    </div>
                  </td>
                  <td>{a.avgConsumption}</td>
                  <td>{a.variability}%</td>
                  <td className="text-emerald-400">{a.efficiencyScore}</td>
                  <td className={a.anomalyRisk > 50 ? 'text-red-400' : a.anomalyRisk > 25 ? 'text-amber-400' : 'text-emerald-400'}>
                    {a.anomalyRisk}%
                  </td>
                  <td className="text-muted-foreground">{a.behaviorLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}