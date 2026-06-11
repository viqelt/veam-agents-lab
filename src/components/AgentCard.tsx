import { motion } from 'framer-motion';
import { Agent } from '@/data/agents';
import { cn } from '@/lib/utils';

interface Props {
  agent: Agent;
  selected?: boolean;
  onClick?: () => void;
}

export default function AgentCard({ agent, selected, onClick }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group relative text-left p-5 rounded-2xl border transition-all overflow-hidden w-full',
        'bg-card/50 backdrop-blur-xl',
        selected
          ? 'border-cyan-400/60 shadow-lg shadow-cyan-500/20'
          : 'border-white/5 hover:border-white/10'
      )}
    >
      {/* Gradient accent top */}
      <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80', agent.accent)} />

      {/* Floating glow */}
      <div
        className={cn(
          'absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-20 blur-3xl bg-gradient-to-br group-hover:opacity-40 transition-opacity',
          agent.accent
        )}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br text-xl flex items-center justify-center shadow-md', agent.accent)}>
              <span>{agent.icon}</span>
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight">{agent.name}</div>
              <div className="text-[11px] text-muted-foreground">{agent.behaviorLabel}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</div>
            <div className="text-lg font-bold gradient-text">{agent.efficiencyScore}</div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {agent.explanation}
        </p>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Avg</div>
            <div className="text-sm font-semibold">{agent.avgConsumption}<span className="text-[10px] text-muted-foreground"> kWh</span></div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Var</div>
            <div className="text-sm font-semibold">{agent.variability}%</div>
          </div>
          <div className="p-2 rounded-lg bg-white/5">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Risk</div>
            <div className={cn('text-sm font-semibold', agent.anomalyRisk > 50 ? 'text-red-400' : agent.anomalyRisk > 25 ? 'text-amber-400' : 'text-emerald-400')}>
              {agent.anomalyRisk}%
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {agent.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}