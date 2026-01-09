import { Button } from './UI/Button';

interface LandingPageProps {
  onStart: () => void;
}

// Icons as SVG components
function WallIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

function FrameIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  );
}

function DrillIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="3" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="21" />
      <line x1="3" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="21" y2="12" />
    </svg>
  );
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#e8edf2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
          textAlign: 'center',
        }}
      >
        {/* App Name */}
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '8px',
          }}
        >
          Hang It
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '48px',
          }}
        >
          Find the perfect spot for your nails
        </p>

        {/* Steps */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '48px',
            textAlign: 'left',
          }}
        >
          <Step
            icon={<WallIcon />}
            title="Measure your wall"
            description="Use a tape measure to get width and height"
          />
          <Step
            icon={<FrameIcon />}
            title="Add what you're hanging"
            description="Set the size and drag to position"
          />
          <Step
            icon={<DrillIcon />}
            title="Mark where to drill"
            description="Get exact measurements from wall edges"
          />
        </div>

        {/* Start Button */}
        <Button
          onClick={onStart}
          style={{
            width: '100%',
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}

function Step({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
          {title}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>{description}</div>
      </div>
    </div>
  );
}
