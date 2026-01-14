import { useState } from 'react';
import { WallCanvas } from './components/Canvas/WallCanvas';
import { WallDimensions } from './components/Controls/WallDimensions';
import { ObjectConfig } from './components/Controls/ObjectConfig';
import { UnitToggle } from './components/Controls/UnitToggle';
import { HoleInfoPanel } from './components/Controls/HoleInfoPanel';
import { LandingPage } from './components/LandingPage';

const STARTED_KEY = 'nail-positioner-started';

function App() {
  const [hasStarted, setHasStarted] = useState(() => {
    return localStorage.getItem(STARTED_KEY) === 'true';
  });

  const handleStart = () => {
    localStorage.setItem(STARTED_KEY, 'true');
    setHasStarted(true);
  };

  if (!hasStarted) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div style={{ height: '100%', width: '100%', backgroundColor: '#e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '1280px', height: '100%', maxHeight: '900px', display: 'flex', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        {/* Left Sidebar */}
        <aside style={{ width: '400px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>Settings</h1>
          </div>

          {/* Controls */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <WallDimensions />
            <ObjectConfig />
          </div>

          {/* Unit Toggle at bottom */}
          <div style={{ padding: '20px 24px', borderTop: '1px solid #f3f4f6' }}>
            <UnitToggle />
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main style={{ flex: 1, position: 'relative', backgroundColor: '#c5d0da' }}>
          <div style={{ position: 'absolute', inset: '24px' }}>
            <WallCanvas />
          </div>
          <HoleInfoPanel />
        </main>
      </div>
    </div>
  );
}

export default App;
