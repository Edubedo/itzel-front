export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col">
      {/* Barra superior */}
      <header className="bg-green-600 text-white p-4 fixed top-0 left-0 w-full shadow-md z-50">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 mt-16 p-6 bg-gray-100">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Bienvenido</h2>
          <p>Aquí irá el contenido de tu dashboard.</p>
        </div>
      </main>
    </div>
  );
}
