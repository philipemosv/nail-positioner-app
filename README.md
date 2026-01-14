# Hang It

A web app for precisely positioning nails when hanging objects on walls. Define your wall dimensions, place objects, configure nail positions, and get exact real-world coordinates for nail placement.

**Live Demo:** [nail-positioner-app.vercel.app](https://nail-positioner-app.vercel.app/)

## Features

- **Wall Setup** - Enter your wall dimensions in cm or inches
- **Object Placement** - Add frames, pictures, or other objects and drag them to position
- **Nail Configuration** - Set exact nail/hole positions relative to each object
- **Smart Snapping** - Auto-snap to wall center, edges, and other objects while dragging
- **Distance Indicators** - See exact distances from nails to wall edges
- **Unit Switching** - Toggle between centimeters and inches
- **PWA Support** - Install as an app on your device

## Tech Stack

- **React 19** + TypeScript
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Konva / React-Konva** - Canvas rendering
- **Zustand** - State management with localStorage persistence

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## How It Works

1. **Measure your wall** - Use a tape measure to get width and height
2. **Add what you're hanging** - Set the size and drag to position
3. **Mark where to drill** - Get exact measurements from wall edges

## Author

Made by [Philipe Oliveira](https://github.com/philipemosv)

## License

MIT
