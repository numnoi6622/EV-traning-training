# EV Research & Training Website - Design Philosophy

## Chosen Design Direction: **Tech-Forward Professional**

### Design Movement
**Modern Minimalism with Electric Accents** — A clean, professional interface inspired by contemporary SaaS and tech education platforms, elevated with electric blue and green accent colors that represent energy and innovation in the EV space.

### Core Principles
1. **Clarity Through Simplicity** — Remove visual noise to let data and curriculum shine; use whitespace strategically
2. **Electric Energy** — Use electric blue (#0066FF) and electric green (#00FF88) as signature colors to convey innovation and technology
3. **Professional Trustworthiness** — Dark navy backgrounds with clean typography to establish credibility for technical training
4. **Data-Driven Aesthetics** — Charts, cards, and structured layouts that make research findings immediately scannable

### Color Philosophy
- **Primary: Electric Blue (#0066FF)** — Represents technology, electricity, and forward-thinking innovation
- **Accent: Electric Green (#00FF88)** — Represents energy, sustainability, and positive momentum
- **Background: Deep Navy (#0A1428)** — Professional, modern, reduces eye strain for data-heavy content
- **Text: White/Light Gray** — High contrast for readability; maintains professional tone
- **Cards/Sections: Subtle gradients** — Adds depth without clutter

### Layout Paradigm
**Asymmetric Grid with Hero-Driven Sections** — Hero section with full-width background image, followed by alternating card layouts (left-aligned content, right-aligned visuals), research cards in a 2-3 column grid, and curriculum sections with clear visual hierarchy.

### Signature Elements
1. **Electric Gradient Dividers** — SVG wave dividers using blue-to-green gradients between sections
2. **Glowing Accent Borders** — Subtle glow effect on key cards and CTAs using electric blue
3. **Data Visualization Cards** — Research findings presented in clean, scannable card format with icons

### Interaction Philosophy
- **Smooth Transitions** — 200-300ms ease-out for hover states and section reveals
- **Interactive Charts** — Hover-activated tooltips on research data
- **Responsive Curriculum Cards** — Expand/collapse sections for detailed curriculum content
- **CTA Glow Effect** — Primary buttons glow on hover to draw attention

### Animation
- **Section Entrance** — Subtle fade-in + 20px slide-up on scroll (staggered by 50ms per card)
- **Hover States** — Scale 1.02 + shadow increase on cards; glow effect on buttons
- **Data Tooltips** — Fade-in 150ms on hover, positioned above data points
- **Smooth Scrolling** — Native scroll behavior with parallax effect on hero image

### Typography System
- **Display Font: Inter Bold (700)** — Headlines and section titles for modern, tech-forward feel
- **Body Font: Inter Regular (400)** — Clear, readable body text
- **Accent Font: Mono (code-style)** — For technical terms, curriculum hours, and data labels
- **Hierarchy**: H1 (32px) → H2 (24px) → H3 (18px) → Body (16px)

### Brand Essence
**One-Line Positioning:** Empowering technicians and EV enthusiasts with research-backed, hands-on training for the electric vehicle revolution.

**Personality Adjectives:** Professional, Innovative, Trustworthy

### Brand Voice
- **Headlines:** Action-oriented, forward-looking ("Master EV Technology," "Unlock Your Potential")
- **CTAs:** Direct and confident ("Explore Curriculum," "View Research Findings")
- **Microcopy:** Clear, jargon-light but technically accurate
- **Example Lines:**
  - "What technicians and EV enthusiasts want to know — backed by 2026 social media research"
  - "30 hours of hands-on training designed for real-world impact"

### Wordmark & Logo
**Logo Concept:** A stylized lightning bolt merged with a charging plug/battery, rendered in electric blue-to-green gradient. Bold, geometric, immediately recognizable. No text in the mark itself — the wordmark is separate.

### Signature Brand Color
**Electric Blue (#0066FF)** — Unmistakably represents the EV space and technology innovation. Used for primary CTAs, key highlights, and the logo gradient.

---

## Implementation Notes
- Use Tailwind 4 with custom OKLCH color variables for the electric palette
- Implement smooth scroll behavior and section-based animations
- Ensure all interactive elements have clear focus states for accessibility
- Use recharts for research data visualization
- Maintain consistent spacing (8px grid) throughout
