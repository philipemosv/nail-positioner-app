# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nail Positioner App - A mobile-first PWA for precisely positioning nails when hanging objects on walls. Users define wall dimensions, place objects, configure nail positions, and receive exact real-world coordinates for nail placement.

## Development Commands

```bash
npm run dev       # Start development server (Vite)
npm run build     # Type-check and build for production
npm run lint      # Run ESLint
npm run test      # Run tests in watch mode (Vitest)
npm run test:run  # Run tests once
npm run preview   # Preview production build
```

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **State**: Zustand with localStorage persistence
- **Canvas**: React-Konva (HTML5 Canvas)
- **Testing**: Vitest + React Testing Library

## Architecture

### Coordinate System
- All internal measurements stored in **centimeters** for precision
- Canvas uses pixel coordinates with a scale factor: `scale = canvas_width_px / wall_width_cm`
- Unit display (cm/inches) is a presentation layer concern only

### State Management
The Zustand store (`src/store/useAppStore.ts`) manages:
- Wall dimensions (width, height in cm)
- Objects array (position, dimensions, nails)
- Selected object/nail IDs
- Display unit preference (cm/inch)

### Key Calculations
```typescript
// Nail absolute position on wall:
nailX = object.x + nail.offsetX
nailY = object.y + nail.offsetY

// Auto-distribution for 2 nails:
margin = objectWidth * 0.15  // 15% from edges
```

## Project Structure

```
src/
├── components/
│   ├── Canvas/       # WallCanvas, WallObject, NailMarker, Guidelines
│   ├── Controls/     # WallDimensions, ObjectConfig, MeasurementPanel, UnitToggle
│   └── UI/           # Reusable Button, Input, Modal components
├── store/            # Zustand store with persistence
├── hooks/            # useSnapping, useMeasurements
├── utils/            # units.ts, nailDistribution.ts, coordinates.ts
├── types/            # TypeScript interfaces (Wall, WallObject, Nail, Unit)
└── constants/        # Default values, snap thresholds
```

## Implementation Status

- [x] Phase 2: Project Setup
- [ ] Phase 3: Core Data Models
- [ ] Phase 4: Virtual Wall Canvas
- [ ] Phase 5: Object Placement
- [ ] Phase 6: Nail Configuration
- [ ] Phase 7: Smart Guidelines
- [ ] Phase 8: Measurement Output
- [ ] Phase 9: Unit Switching
- [ ] Phase 10: Mobile UX Polish
- [ ] Phase 11: Final Testing & Build

## Mobile-First Design Principles

- Bottom sheet panels for controls (thumb-reachable)
- 44px minimum touch targets
- Canvas takes majority of viewport
- Portrait orientation optimized
