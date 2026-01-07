import './App.css'

function App() {
  return (
    <div className="h-full w-full bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white px-4 py-3 shadow-md">
        <h1 className="text-lg font-semibold">Nail Positioner</h1>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Canvas will render here</p>
        </div>

        <div className="bg-white border-t p-4">
          <p className="text-gray-600 text-sm">Control panel</p>
        </div>
      </main>
    </div>
  )
}

export default App
