# SitePulse Design Guidelines

## Design Approach
**Aesthetic Direction:** Professional enterprise-grade glassmorphic design with neon accents  
**Primary Reference:** Modern SaaS dashboards (Vercel, Railway, Linear) with glassmorphism and cyberpunk-inspired neon elements  
**Core Principle:** Sophisticated, feature-rich monitoring interface with advanced controls and real-time data visualization

## Color Palette

**Dark Mode Primary (Required):**
- Background: Deep dark (220 15% 8%) with subtle gradient overlay
- Glass panels: Semi-transparent white/blue overlays with backdrop blur
- Primary accent: Electric blue (220 90% 60%)
- Secondary accent: Vibrant purple (270 80% 65%)
- Neon glow: Cyan-blue (190 95% 55%)
- Success green: (140 70% 50%)
- Error red: (0 85% 60%)

**Gradient Applications:**
- Button: Linear gradient from blue to purple (220 90% 60% → 270 80% 65%)
- Background ambiance: Radial gradients with blue/purple for depth
- Glow effects: Use box-shadow with neon blue/purple at 50% opacity

## Typography

**Font Families:**
- Primary: 'Inter' (via Google Fonts CDN)
- Alternative: 'Poppins' (via Google Fonts CDN)
- Use Inter for better readability in utility contexts

**Type Scale:**
- Hero/Title: text-4xl to text-5xl, font-semibold (600)
- Section headers: text-2xl to text-3xl, font-medium (500)
- Body text: text-base to text-lg, font-normal (400)
- Labels/Small: text-sm, font-medium (500)
- Monospace data (IP, time): font-mono, text-base

## Layout System

**Spacing Units:** Tailwind units of 4, 6, 8, 12, 16, 24 (as in p-4, mb-8, space-y-6)

**Container Structure:**
- Full viewport dark background with gradient overlay
- Central card: max-w-2xl, centered with mx-auto
- Vertical rhythm: space-y-6 to space-y-8 between sections
- Padding: p-8 to p-12 for glass panels

**Glassmorphic Panel Specifications:**
- Backdrop blur: backdrop-blur-lg (16px)
- Background: bg-white/10 with border border-white/20
- Shadow: Soft shadow with neon glow on edges
- Border radius: rounded-2xl (16px)

## Component Library

**Input Card (Central):**
- Glassmorphic container with neon border glow
- URL input: Rounded (rounded-xl), transparent background with white/20 overlay, white text
- Focus state: Ring with neon blue glow, increased brightness
- Placeholder: text-gray-400, subtle and minimal

**Check Status Button:**
- Full-width gradient (blue → purple)
- Rounded-xl with py-4 padding
- Hover: Scale up slightly (scale-105), increased glow intensity
- Active state: Scale down (scale-95)
- Icon: Signal or zap icon from lucide-react, inline with text

**Results Section:**
- Glassmorphic panel appearing below input card
- Grid layout for data points (2 columns on desktop, 1 on mobile)
- Each metric in its own card with icon + label + value
- Status badge: Pill-shaped with ✅/❌ emoji and color-coded background

**Data Display Cards:**
- Mini glass panels (bg-white/5) with subtle border
- Icon (cloud, globe, link, lock from lucide-react) in accent color
- Label: text-sm, text-gray-400
- Value: text-lg to text-xl, font-semibold, white text
- Monospace for technical data (IP addresses, response times)

**Status Indicators:**
- Reachable: Green background (bg-green-500/20) with green text and ✅
- Unreachable: Red background (bg-red-500/20) with red text and ❌
- Pulse animation on status change

## Animations

**Framer Motion Specifications:**
- Fade-in: opacity 0 → 1, duration 0.5s
- Slide-up: y: 20 → 0 with fade-in
- Pulse: Scale 1 → 1.05 → 1 on status icons (loop)
- Button hover: Smooth scale and glow transitions (0.2s)
- Results appear: Stagger children by 0.1s delay

**Interaction States:**
- Input focus: Neon glow ring animation
- Button hover: Gradient shift and glow expansion
- Loading state: Spinning icon or pulsing button text

## Icons & Visual Elements

**Lucide React Icons:**
- Globe2: Main app icon/logo
- Signal: Check status button
- Cloud: Server/connectivity indicators
- Link: URL input field
- Lock/Shield: SSL status
- Clock: Response time
- Server: IP address display

**Icon Styling:**
- Size: w-5 h-5 to w-6 h-6 for inline icons
- Accent colors for active states
- Subtle gray for inactive/decorative

## Layout Structure

**Professional Dashboard Layout:**
- Header bar: Logo, navigation tabs, settings, theme toggle
- Main content area: Two-column layout (desktop) / stacked (mobile)
  - Left column (60%): Check interface + Results display
  - Right column (40%): URL history + Advanced options
- Tabbed interface for: Single Check, Batch Check, History, Settings
- Footer with export options and status indicators
- Background: Dark gradient with subtle animated blobs (blue/purple radial gradients)

**Advanced Features:**
- URL history panel with timestamps and quick re-check
- Batch URL checking (multiple URLs at once)
- Advanced settings: timeout, follow redirects, custom headers
- Detailed metrics: DNS time, TCP connection, TLS handshake
- Export functionality (JSON, CSV)
- Real-time status updates with WebSocket support (future)

## Accessibility & Polish

- Maintain dark theme throughout (no light mode)
- Glass panels must have sufficient contrast for white text
- Focus states clearly visible with neon rings
- Error states in red with clear messaging
- Loading states with smooth transitions
- All text remains readable over glassmorphic backgrounds