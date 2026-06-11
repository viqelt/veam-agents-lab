import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Activity, LineChart, Cpu, GitCompare, Settings as Cog, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/agents', label: 'Agents', icon: Users },
  { to: '/simulation', label: 'Simulation', icon: Activity },
  { to: '/prediction', label: 'Prediction', icon: LineChart },
  { to: '/nilm', label: 'NILM', icon: Cpu },
  { to: '/comparison', label: 'Compare', icon: GitCompare },
  { to: '/settings', label: 'Settings', icon: Cog },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-card/40 backdrop-blur-xl sticky top-0 h-screen z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Sparkles className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 blur-lg opacity-40 animate-pulse-glow" />
          </div>
          <div>
            <div className="font-semibold tracking-tight text-sm">VEAM</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Agents Lab</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/10 text-white'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-gradient-to-b from-cyan-400 to-violet-500"
                      />
                    )}
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 mx-3 mb-4 rounded-xl border border-white/5 bg-gradient-to-br from-cyan-500/10 to-violet-500/10">
          <div className="text-xs font-medium text-white mb-1">VEAM v2.6</div>
          <div className="text-[11px] text-muted-foreground">Energy simulation platform for NILM & behavior modeling.</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 relative z-10">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-white/5 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-none">VEAM</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Agents Lab</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {location.pathname.slice(1) || 'home'}
          </div>
        </div>

        <div className="pb-24 md:pb-10">
          <Outlet />
        </div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card/80 backdrop-blur-xl border-t border-white/5 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] transition-colors',
                      isActive ? 'text-cyan-400' : 'text-muted-foreground'
                    )
                  }
                >
                  <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}