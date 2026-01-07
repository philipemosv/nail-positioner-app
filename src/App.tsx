import './App.css';
import { WallCanvas } from './components/Canvas/WallCanvas';
import { WallDimensions } from './components/Controls/WallDimensions';

function App() {
  return (
    <div className="h-full w-full bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white px-4 py-3 shadow-md shrink-0">
        <h1 className="text-lg font-semibold">Nail Positioner</h1>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Canvas area */}
        <div className="flex-1 min-h-0">
          <WallCanvas />
        </div>

        {/* Control panel */}
        <div className="bg-white border-t shadow-lg p-4 shrink-0 max-h-[40vh] overflow-y-auto">
          <WallDimensions />
        </div>
      </main>
    </div>
  );
}

export default App;
