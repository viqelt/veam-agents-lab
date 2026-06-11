import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agents, Agent, generateHourlySeries, generateInsights } from '@/data/agents';
import AgentCard from '@/components/AgentCard';
import { X, Zap, TrendingUp, Activity, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';

export default function Agents() {
  const [selected, setSelected] = useState<Agent | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return agents;
    if (filter === 'efficient') return agents.filter((a) => a.efficiencyScore >= 80);
    if (filter === 'risky') return agents.filter((a) => a.anomalyRisk >= 40);
    if (filter === 'low') return agents.filter((a) => a.avgConsumption <= 12);
    if (filter === 'high') return agents.filter((a) => a.avgConsumption > 20);
    return agents;
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 md:pt-12">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">Dashboard</div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Agent Profiles</h1>
        <p className="text-muted-foreground mt-2 text-sm max-w-2xl">
          Ten household energy agents ready to explore. Click any card for detailed behavior analysis,
          forecasts, and AI insights.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All agents' },
          { id: 'efficient', label: 'Most efficient' },
          { id: 'risky', label: 'High risk' },
          { id: 'low', label: 'Low usage' },
          { id: 'high', label: 'High usage' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all',
              filter === f.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-400/40 text-white'
                : 'bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onClick={() => setSelected(agent)} />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <AgentDetail agent={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AgentDetail({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const series = useMemo(() => generateHourlySeries(agent), [agent]);
  const insights = useMemo(() => generateInsights(agent), [agent]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto scrollbar-thin rounded-t-3xl md:rounded-3xl border border-white/10 bg-card shadow-2xl"
      >
        <div className={cn('h-1 bg-gradient-to-r', agent.accent)} />

        <div className="p-6 md:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 mb-6">
            <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br text-2xl flex items-center justify-center', agent.accent)}>
              {agent.icon}
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{agent.name}</h2>
              <div className="text-sm text-muted-foreground">{agent.behaviorLabel}</div>
              <div className="flex gap-1.5 mt-2">
                {agent.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{agent.explanation}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Metric icon={<Zap className="w-4 h-4" />} label="Avg kWh/day" value={agent.avgConsumption.toString()} />
            <Metric icon={<Activity className="w-4 h-4" />} label="Variability" value={`${agent.variability}%`} />
            <Metric icon={<TrendingUp className="w-4 h-4" />} label="Efficiency" value={`${agent.efficiencyScore}/100`} accent="text-emerald-400" />
            <Metric icon={<Lightbulb className="w-4 h-4" />} label="Anomaly risk" value={`${agent.anomalyRisk}%`} accent={agent.anomalyRisk > 50 ? 'text-red-400' : 'text-amber-400'} />
          </div>

          <div className="rounded-xl border border-white/5 bg-background/40 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">24-hour load profile</div>
              <div className="text-xs text-muted-foreground">{agent.predictionProfile}</div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id={`g-${agent.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0D1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="kw" stroke="#22d3ee" strokeWidth={2} fill={`url(#g-${agent.id})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-3">AI Insights</div>
            <div className="space-y-2">
              {insights.slice(0, 3).map((ins) => (
                <div key={ins.id} className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-1">
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
      </motion.div>
    </motion.div>
  );
}

function Metric({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-widest mb-1">
        {icon}
        {label}
      </div>
      <div className={cn('text-lg font-semibold', accent)}>{value}</div>
    </div>
  );
}