# VEAM Agents Lab — Development Plan

## Design System
- **Theme**: Dark mode first, futuristic 2026 AI product aesthetic
- **Colors**:
  - Background: #07080F (deep space), #0D1020 (cards)
  - Accents: Cyan #22D3EE, Electric Blue #3B82F6, Violet #8B5CF6, Neon Green #34D399
  - Text: #E5E7EB primary, #94A3B8 secondary
- **Typography**: Inter (system sans), tight tracking on headings
- **Components**: rounded-xl/2xl, soft glow shadows, subtle gradients, backdrop-blur
- **Animations**: Framer Motion fade/slide, subtle hover scale, pulse glows

## Development Tasks
- [x] Create mock data module (src/data/agents.ts) with 10 agent profiles, time series, appliance signatures
- [x] Create shared layout with responsive navigation (Sidebar + BottomNav)
- [x] Build Home landing page with hero + animated energy visualization
- [x] Build Agents dashboard page with grid + detail modal
- [x] Build Simulation page with multi-agent compare + forecasted curves
- [x] Build Prediction page with forecast chart + confidence + warnings
- [x] Build NILM analysis page with appliance disaggregation timeline
- [x] Build Comparison page with side-by-side agent metrics
- [x] Build Settings page with theme/units/notifications
- [x] Wire routes in App.tsx and replace Index.tsx; add theme tokens & global styles
- [x] Run lint check (passed)