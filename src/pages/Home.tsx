import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Cpu, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import { agents } from '@/data/agents';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 md:pt-16">
      {/* Hero */}
      <section className="relative">
        <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

        <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-xs text-cyan-300 mb-6">
              <Sparkles className="w-3 h-3" />
              <span>AI-native energy simulation · 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-5">
              Simulate how <span className="gradient-text">homes consume energy</span>, agent by agent.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              VEAM Agents Lab lets you explore, compare, and forecast household energy behavior using
              intelligent agents built for NILM, load prediction, and behavior modeling.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/agents"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 text-white text-sm font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow"
              >
                Explore Agents <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/simulation"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Run Simulation
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
              <Stat label="Agents" value="10" />
              <Stat label="NILM signatures" value="7" />
              <Stat label="Forecast horizon" value="7d" />
            </div>
          </motion.div>

          {/* Animated visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[480px]"
          >
            <EnergyVisualization />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-24">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">Core capabilities</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Built for modern energy intelligence</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <Feature
            icon={<Activity className="w-5 h-5" />}
            title="Behavior Simulation"
            body="Run hour-by-hour simulations of household load using ten distinct agent profiles."
            color="from-cyan-400 to-blue-500"
          />
          <Feature
            icon={<TrendingUp className="w-5 h-5" />}
            title="Predictive Forecasting"
            body="Forecast consumption with confidence bands, peak warnings, and trend reasoning."
            color="from-violet-400 to-fuchsia-500"
          />
          <Feature
            icon={<Cpu className="w-5 h-5" />}
            title="NILM Disaggregation"
            body="Break down total load into appliance-level signatures with confidence scores."
            color="from-emerald-400 to-cyan-500"
          />
          <Feature
            icon={<Shield className="w-5 h-5" />}
            title="Anomaly Detection"
            body="Spot irregular patterns and standby waste before they impact the bill."
            color="from-pink-400 to-red-500"
          />
          <Feature
            icon={<Zap className="w-5 h-5" />}
            title="Side-by-side Compare"
            body="Benchmark agents on efficiency, peaks, stability, and anomaly probability."
            color="from-amber-400 to-orange-500"
          />
          <Feature
            icon={<Sparkles className="w-5 h-5" />}
            title="AI Insights"
            body="Receive plain-language recommendations on how to optimize each profile."
            color="from-blue-400 to-violet-500"
          />
        </div>
      </section>

      {/* Featured agents */}
      <section className="mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">Meet the agents</div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">A diverse set of household profiles</h2>
          </div>
          <Link to="/agents" className="hidden md:inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {agents.slice(0, 5).map((a) => (
            <Link
              key={a.id}
              to="/agents"
              className="group p-4 rounded-xl border border-white/5 bg-card/40 hover:bg-card/70 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${a.accent} flex items-center justify-center text-lg mb-3`}>
                {a.icon}
              </div>
              <div className="text-sm font-medium">{a.name}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{a.behaviorLabel}</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-24 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
        VEAM Agents Lab · Built for researchers, designers, and energy engineers.
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-semibold gradient-text">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Feature({ icon, title, body, color }: { icon: React.ReactNode; title: string; body: string; color: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-6 rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl relative overflow-hidden"
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl`} />
      <div className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${color} text-white flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
    </motion.div>
  );
}

function EnergyVisualization() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer ring */}
      <div className="absolute inset-8 rounded-full border border-cyan-500/20 animate-pulse-glow" />
      <div className="absolute inset-16 rounded-full border border-violet-500/20" />
      <div className="absolute inset-24 rounded-full border border-blue-500/20" />

      {/* Central core */}
      <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-2xl shadow-cyan-500/30 flex items-center justify-center animate-pulse-glow">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 blur-2xl opacity-60" />
        <div className="relative w-32 h-32 rounded-full bg-background flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-cyan-300" />
        </div>
      </div>

      {/* Orbiting dots */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-cyan-300 to-violet-400 shadow-lg shadow-cyan-500/50"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20 + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          initial={{
            x: Math.cos((angle * Math.PI) / 180) * 140 - 6,
            y: Math.sin((angle * Math.PI) / 180) * 140 - 6,
          }}
        />
      ))}

      {/* Floating cards */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-8 left-4 md:left-0 p-3 rounded-xl bg-card/70 backdrop-blur-xl border border-white/10 shadow-xl"
      >
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Forecast</div>
        <div className="text-sm font-semibold mt-0.5">14.5 kWh</div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-8 right-4 md:right-0 p-3 rounded-xl bg-card/70 backdrop-blur-xl border border-white/10 shadow-xl"
      >
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Efficiency</div>
        <div className="text-sm font-semibold mt-0.5 text-emerald-400">92 / 100</div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
        className="absolute top-1/2 right-0 md:-right-4 p-3 rounded-xl bg-card/70 backdrop-blur-xl border border-white/10 shadow-xl"
      >
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Peak</div>
        <div className="text-sm font-semibold mt-0.5 text-amber-400">19:30</div>
      </motion.div>
    </div>
  );
}