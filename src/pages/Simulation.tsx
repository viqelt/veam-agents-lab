import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { agents, generateHourlySeries } from '@/data/agents';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Play, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['#22d3ee', '#8b5cf6', '#34d399', '#f472b6', '#fbbf24'];

type Range = '24h' | '7d' | '30d';

export default function Simulation() {
  const [selected, setSelected] = useState<string[]>([agents[1].id, agents[4].id]);
  const [range, setRange] = useState<Range>('24h');
  const [running, setRunning] = useState(false);

  const chartData = useMemo(() => {
    const hours = range === '24h' ? 24 : range === '7d' ? 168 : 720;
    const step = range === '24h' ? 1 : range === '7d' ? 3 : 12;

    const result: Record<string, unknown>[] = [];
    const seriesMap = new Map<string, number[]>();

    selected.forEach((id) => {
      const a = agents.find((x) => x.id === id)!;
      const arr: number[] = [];
      for (let i = 0; i < hours; i += step) {
        const day = generateHourlySeries(a);
        arr.push(day[i % 24].kw);
      }
      seriesMap.set(id, arr);
    });

    const length = Math.ceil(hours / step);
    for (let i = 0; i < length; i++) {
      const row: Record<string, unknown> = {
        label: range === '24h' ? `${i}:00` : range === '7d' ? `D${Math.floor(i / (24 / step)) + 1} ${((i * step) % 24).toString().padStart(2, '0')}:00` : `D${Math.floor(i / (24 / step)) + 1}`,
      };
      selected.forEach((id) => {
        const a = agents.find((x) => x.id === id)!;
        row[a.name] = seriesMap.get(id)?.[i] ?? 0;
      });
      result.push(row);
    }
    return result;
  }, [selected, range, running]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAgent = (id: string) => {
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < 5 ? [...cur, id] : cur
    );
  };

  const runSim = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 md:pt-12">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">Simulation Engine</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Simulate Energy Behavior</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-2xl">
          Select up to 5 agents and watch how their consumption evolves across hours, days, or weeks.
        </p>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5">
            <div className="text-sm font-medium mb-3">Time range</div>
            <div className="grid grid-cols-3 gap-2">
              {(['24h', '7d', '30d'] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    'py-2 rounded-lg text-xs font-medium transition',
                    range === r
                      ? 'bg-gradient-to-r from-cyan-500/30 to-violet-500/20 border border-cyan-400/40 text-white'
                      : 'bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/10'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Agents</div>
              <div className="text-[10px] text-muted-foreground">{selected.length}/5</div>
            </div>
            <div className="space-y-1.5 max-h-80 overflow-y-auto scrollbar-thin pr-1">
              {agents.map((a) => {
                const on = selected.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAgent(a.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-2 rounded-lg transition text-left',
                      on ? 'bg-white/10 border border-cyan-400/30' : 'bg-white/[0.02] border border-transparent hover:bg-white/5'
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm', a.accent)}>
                      {a.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{a.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{a.behaviorLabel}</div>
                    </div>
                    {on && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={runSim}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-white text-sm font-medium shadow-lg shadow-cyan-500/20 inline-flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Run Simulation
            </button>
            <button
              onClick={() => setSelected([agents[1].id])}
              className="px-3 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          <motion.div
            key={running ? 'running' : 'idle'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium">Forecasted consumption</div>
                <div className="text-xs text-muted-foreground mt-0.5">kWh across {range}</div>
              </div>
              {running && (
                <div className="text-xs text-cyan-400 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Simulating…
                </div>
              )}
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0D1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {selected.map((id, i) => {
                    const a = agents.find((x) => x.id === id)!;
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={a.name}
                        stroke={COLORS[i % COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selected.slice(0, 3).map((id, i) => {
              const a = agents.find((x) => x.id === id)!;
              return (
                <div key={id} className="rounded-xl border border-white/5 bg-card/40 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-xs font-medium">{a.name}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed">{a.predictionProfile}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}