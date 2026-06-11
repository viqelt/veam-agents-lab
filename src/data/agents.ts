export type BehaviorType =
  | 'low'
  | 'average'
  | 'high'
  | 'irregular'
  | 'efficient'
  | 'wasteful'
  | 'solar'
  | 'night'
  | 'family'
  | 'student';

export interface Agent {
  id: string;
  name: string;
  behaviorType: BehaviorType;
  behaviorLabel: string;
  avgConsumption: number; // kWh/day
  variability: number; // 0-100
  efficiencyScore: number; // 0-100
  predictionProfile: string;
  anomalyRisk: number; // 0-100
  explanation: string;
  accent: string; // tailwind color
  icon: string; // emoji fallback
  tags: string[];
}

export const agents: Agent[] = [
  {
    id: 'a-low',
    name: 'Aurora',
    behaviorType: 'low',
    behaviorLabel: 'Low Consumption',
    avgConsumption: 6.2,
    variability: 18,
    efficiencyScore: 92,
    predictionProfile: 'Stable, flat usage with small evening peak.',
    anomalyRisk: 8,
    explanation: 'A minimalist home with few appliances and mindful habits. Usage stays low and predictable.',
    accent: 'from-emerald-400 to-cyan-400',
    icon: '🌱',
    tags: ['Eco', 'Stable'],
  },
  {
    id: 'a-avg',
    name: 'Meridian',
    behaviorType: 'average',
    behaviorLabel: 'Average Consumption',
    avgConsumption: 14.5,
    variability: 35,
    efficiencyScore: 71,
    predictionProfile: 'Typical double-peak (morning + evening).',
    anomalyRisk: 22,
    explanation: 'A balanced household that reflects national averages with predictable daily rhythm.',
    accent: 'from-cyan-400 to-blue-500',
    icon: '🏠',
    tags: ['Typical', 'Balanced'],
  },
  {
    id: 'a-high',
    name: 'Vortex',
    behaviorType: 'high',
    behaviorLabel: 'High Consumption',
    avgConsumption: 28.3,
    variability: 40,
    efficiencyScore: 48,
    predictionProfile: 'Sustained high load, strong HVAC cycles.',
    anomalyRisk: 35,
    explanation: 'A large home with many active devices and heavy climate control. Peaks are significant.',
    accent: 'from-orange-400 to-pink-500',
    icon: '⚡',
    tags: ['High Load', 'HVAC'],
  },
  {
    id: 'a-irreg',
    name: 'Nebula',
    behaviorType: 'irregular',
    behaviorLabel: 'Irregular Home',
    avgConsumption: 17.8,
    variability: 82,
    efficiencyScore: 54,
    predictionProfile: 'Chaotic pattern, hard to forecast accurately.',
    anomalyRisk: 68,
    explanation: 'Usage shifts unpredictably — shift workers, frequent guests, or inconsistent routines.',
    accent: 'from-pink-400 to-violet-500',
    icon: '🌀',
    tags: ['Chaotic', 'Hard to Predict'],
  },
  {
    id: 'a-eff',
    name: 'Helix',
    behaviorType: 'efficient',
    behaviorLabel: 'Efficient Home',
    avgConsumption: 9.1,
    variability: 22,
    efficiencyScore: 96,
    predictionProfile: 'Optimized schedules, smart devices active.',
    anomalyRisk: 6,
    explanation: 'Smart thermostats, efficient appliances, and scheduled loads. A benchmark profile.',
    accent: 'from-green-400 to-emerald-500',
    icon: '✨',
    tags: ['Smart', 'Optimized'],
  },
  {
    id: 'a-waste',
    name: 'Blaze',
    behaviorType: 'wasteful',
    behaviorLabel: 'Wasteful Home',
    avgConsumption: 32.7,
    variability: 55,
    efficiencyScore: 28,
    predictionProfile: 'Appliances left on, standby power high.',
    anomalyRisk: 72,
    explanation: 'Devices rarely turned off, old appliances, and poor insulation drive up the load.',
    accent: 'from-red-400 to-orange-500',
    icon: '🔥',
    tags: ['Wasteful', 'Standby'],
  },
  {
    id: 'a-solar',
    name: 'Solaris',
    behaviorType: 'solar',
    behaviorLabel: 'Solar-friendly Home',
    avgConsumption: 11.4,
    variability: 30,
    efficiencyScore: 88,
    predictionProfile: 'Net-positive midday, evening grid draw.',
    anomalyRisk: 14,
    explanation: 'Rooftop solar covers most daytime load. Grid usage concentrates in the evening.',
    accent: 'from-yellow-400 to-amber-500',
    icon: '☀️',
    tags: ['Solar', 'Green'],
  },
  {
    id: 'a-night',
    name: 'Lumen',
    behaviorType: 'night',
    behaviorLabel: 'Night-active Home',
    avgConsumption: 15.6,
    variability: 42,
    efficiencyScore: 63,
    predictionProfile: 'Inverted pattern — peaks after midnight.',
    anomalyRisk: 30,
    explanation: 'Occupants work or live on a night schedule. Load peaks when most homes are quiet.',
    accent: 'from-indigo-400 to-purple-500',
    icon: '🌙',
    tags: ['Night', 'Inverted'],
  },
  {
    id: 'a-family',
    name: 'Orion',
    behaviorType: 'family',
    behaviorLabel: 'Family Home',
    avgConsumption: 22.1,
    variability: 48,
    efficiencyScore: 66,
    predictionProfile: 'Strong morning + dinner peaks, weekend rise.',
    anomalyRisk: 25,
    explanation: 'Multiple occupants, cooking, laundry, entertainment — classic family usage shape.',
    accent: 'from-blue-400 to-indigo-500',
    icon: '👨‍👩‍👧',
    tags: ['Family', 'Multi-user'],
  },
  {
    id: 'a-student',
    name: 'Pixel',
    behaviorType: 'student',
    behaviorLabel: 'Student Home',
    avgConsumption: 8.7,
    variability: 60,
    efficiencyScore: 74,
    predictionProfile: 'Late-night spikes, low morning usage.',
    anomalyRisk: 38,
    explanation: 'Small apartment, electronics-heavy, late-night habits, and low overall footprint.',
    accent: 'from-violet-400 to-fuchsia-500',
    icon: '🎓',
    tags: ['Student', 'Small'],
  },
];

// Generate 24-hour time series for each agent
export function generateHourlySeries(agent: Agent): { hour: number; kw: number }[] {
  const base = agent.avgConsumption / 24;
  const variability = agent.variability / 100;
  const data: { hour: number; kw: number }[] = [];

  for (let h = 0; h < 24; h++) {
    let shape = 1;
    switch (agent.behaviorType) {
      case 'low':
        shape = 0.7 + 0.3 * Math.sin(((h - 18) * Math.PI) / 12);
        break;
      case 'average':
      case 'family':
        shape = 0.6 + (h >= 6 && h <= 9 ? 1.2 : 0) + (h >= 17 && h <= 21 ? 1.5 : 0);
        break;
      case 'high':
      case 'wasteful':
        shape = 1.2 + 0.5 * Math.cos((h * Math.PI) / 12) + (h >= 16 && h <= 22 ? 1 : 0);
        break;
      case 'irregular':
        shape = 0.5 + Math.random() * 2;
        break;
      case 'efficient':
        shape = 0.7 + (h >= 18 && h <= 21 ? 0.8 : 0);
        break;
      case 'solar':
        shape = h >= 10 && h <= 15 ? 0.2 : h >= 18 && h <= 22 ? 1.8 : 0.8;
        break;
      case 'night':
        shape = h >= 22 || h <= 4 ? 2.2 : 0.4;
        break;
      case 'student':
        shape = h >= 20 || h <= 2 ? 1.8 : h >= 9 && h <= 16 ? 0.3 : 0.7;
        break;
    }
    const noise = 1 + (Math.random() - 0.5) * variability * 0.6;
    data.push({ hour: h, kw: Math.max(0.05, +(base * shape * noise).toFixed(2)) });
  }
  return data;
}

export function generateForecast(agent: Agent, hours = 24): { hour: number; predicted: number; lower: number; upper: number }[] {
  const series = generateHourlySeries(agent);
  return series.map((p) => ({
    hour: p.hour,
    predicted: +(p.kw * (0.95 + Math.random() * 0.1)).toFixed(2),
    lower: +(p.kw * 0.75).toFixed(2),
    upper: +(p.kw * 1.25).toFixed(2),
  })).slice(0, hours);
}

export interface Appliance {
  id: string;
  name: string;
  icon: string;
  confidence: number;
  avgLoad: number; // kW
  activeHours: number[];
  color: string;
}

export function generateAppliances(agent: Agent): Appliance[] {
  const base: Appliance[] = [
    { id: 'fridge', name: 'Refrigerator', icon: '🧊', confidence: 0.96, avgLoad: 0.12, activeHours: Array.from({ length: 24 }, (_, i) => i), color: '#22d3ee' },
    { id: 'hvac', name: 'HVAC / AC', icon: '❄️', confidence: 0.88, avgLoad: 1.8, activeHours: [7, 8, 9, 12, 13, 18, 19, 20, 21], color: '#60a5fa' },
    { id: 'washer', name: 'Washing Machine', icon: '🌀', confidence: 0.82, avgLoad: 0.9, activeHours: [10, 20], color: '#a78bfa' },
    { id: 'oven', name: 'Oven / Cooking', icon: '🍳', confidence: 0.79, avgLoad: 1.4, activeHours: [7, 12, 18, 19], color: '#f472b6' },
    { id: 'tv', name: 'TV & Electronics', icon: '📺', confidence: 0.91, avgLoad: 0.3, activeHours: [18, 19, 20, 21, 22], color: '#34d399' },
    { id: 'lights', name: 'Lighting', icon: '💡', confidence: 0.94, avgLoad: 0.15, activeHours: [6, 7, 18, 19, 20, 21, 22, 23], color: '#fbbf24' },
    { id: 'ev', name: 'EV Charger', icon: '🔌', confidence: 0.73, avgLoad: 3.2, activeHours: [23, 0, 1, 2, 3] , color: '#f87171'},
  ];
  // Customize intensity by agent
  return base.map((a) => ({
    ...a,
    confidence: +(a.confidence * (0.85 + Math.random() * 0.15)).toFixed(2),
    avgLoad: +(a.avgLoad * (agent.avgConsumption / 14)).toFixed(2),
  }));
}

export interface Insight {
  id: string;
  type: 'tip' | 'warning' | 'prediction' | 'optimization';
  title: string;
  body: string;
}

export function generateInsights(agent: Agent): Insight[] {
  const insights: Insight[] = [];
  if (agent.efficiencyScore < 60) {
    insights.push({ id: '1', type: 'warning', title: 'Efficiency below target', body: `${agent.name} operates at ${agent.efficiencyScore}/100 efficiency. Consider upgrading HVAC cycles or insulation.` });
  }
  if (agent.anomalyRisk > 50) {
    insights.push({ id: '2', type: 'warning', title: 'High anomaly risk', body: `Usage patterns show ${agent.anomalyRisk}% anomaly probability. Watch for standby loads overnight.` });
  }
  insights.push({ id: '3', type: 'tip', title: 'Shift loads off-peak', body: `Move laundry and EV charging to 01:00–05:00 to reduce costs by ~18%.` });
  insights.push({ id: '4', type: 'prediction', title: 'Tomorrow forecast', body: `Expect ${(agent.avgConsumption * 1.03).toFixed(1)} kWh with a peak near 19:00. Confidence ${95 - agent.variability / 4 | 0}%.` });
  insights.push({ id: '5', type: 'optimization', title: 'Smart schedule suggestion', body: `Pre-cool at 16:00 and reduce setpoint by 2°C between 18:00–21:00 to flatten the evening peak.` });
  return insights;
}