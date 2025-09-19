// dashboard.tsx   !!!!

import React, { useState, useEffect } from "react";
import { Clipboard, Volume2, Clock, ChevronDown } from "lucide-react";

interface Turno {
  i_numero_turno: number;
  ck_area: string;
  ck_sucursal: string;
  ck_estatus: string; //activo, process atendi
}

const Dashboard: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [sucursales, setSucursales] = useState<string[]>([]);
  const [sucursalActiva, setSucursalActiva] = useState<string>("");

  const [turnoActual, setTurnoActual] = useState<Turno | null>(null);
  const [turnosSiguientes, setTurnosSiguientes] = useState<Turno[]>([]);



  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Formato de hora (12h con AM/PM)
  const formattedTime = time.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Formato de fecha en español
  const formattedDate = time.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });



  // simular API de sucursales
  useEffect(() => {
    const data = [
      "Manzanillo, Colima",
      "Colima, Colima",
      "Tecomán, Colima",
      "Armería, Colima",
    ];
    setSucursales(data);
    setSucursalActiva(data[0]); // primera por defecto
  }, []);



  useEffect(() => {
    if (!sucursalActiva) return;

  const fetchTurnos = () => {
    fetch(`http://localhost:3001/api/operaciones/turnos/obtenerTurnos`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Turnos cargados:", data); // 👈 checa aquí
        // Turno en proceso (el que se está atendiendo)
        const actual = data.find((t: any) => t.ck_estatus === "PROCES");
        // Próximos turnos (los que aún esperan)
        const siguientes = data.filter(
          (t: any) => t.ck_estatus === "ACTIVO");
        setTurnoActual(actual || null);
        setTurnosSiguientes(siguientes);
      })
      .catch((err) => console.error("Error cargando turnos:", err));
  }; 
  fetchTurnos ();

   // 🔄 refrescar cada 3 segundos
  const interval = setInterval(fetchTurnos, 3000);
  return () => clearInterval(interval);
}, [sucursalActiva]);


  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-[#1b3528] text-white px-6 py-3 relative">
        {/* Selector de sucursal */}
        <div className="relative group">
          <button className="flex items-center gap-2 text-base md:text-lg font-semibold">
            {sucursalActiva || "Selecciona sucursal"}
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Dropdown */}
          <div className="absolute mt-2 bg-white text-black rounded shadow-lg hidden group-hover:block z-50 w-48">
            {sucursales.map((suc, index) => (
              <button
                key={index}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => setSucursalActiva(suc)}
              >
                {suc}
              </button>
            ))}
          </div>
        </div>
          <Clock className="w-5 h-5" />
          <div className="text-right leading-tight">
            <div className="text-sm md:text-base font-semibold">
              {formattedTime}
            </div>
            <div className="text-xs md:text-sm">{formattedDate}</div>
          </div>
        </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 p-4 bg-[#f5f5f0]">
        {/* Columna IZQUIERDA */}
        <div className="flex flex-col gap-4">
          {/* TURNO ACTUAL encabezado */}
          <div className="bg-[#f0e7c8] px-4 py-3 rounded shadow">
            <h2 className="text-xl md:text-2xl font-bold uppercase">
              Turno Actual
            </h2>
          </div>

          {/* Número de turno */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#eaf4e2] to-[#d6e5c7] rounded shadow flex-1 py-10">
            <span className="text-lg font-semibold mb-2">TURNO ACTUAL</span>
            <span className="text-8xl font-bold text-black">
              {turnoActual ? turnoActual.i_numero_turno : "--"}
            </span>
          </div>

          {/* Módulo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-center items-center bg-[#f0e7c8] rounded shadow py-3">
              <span className="text-sm font-semibold uppercase">Módulo</span>
              <Volume2 className="w-6 h-6 mt-1" />
            </div>
            <div className="flex items-center justify-center bg-[#a7c08d] rounded shadow">
              <span className="text-3xl md:text-4xl font-bold text-white">
                {turnoActual ? turnoActual.ck_area : "--"}
              </span>
            </div>
          </div>
        </div>

        {/* Columna DERECHA */}
        <div className="flex flex-col gap-4">
          {/* Encabezado */}
          <div className="bg-[#f0e7c8] px-4 py-3 rounded shadow flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold uppercase">
              Próximos Turnos
            </h2>
            <Clipboard className="w-5 h-5" />
          </div>

          {/* Lista de turnos */}
          <div className="flex flex-col gap-3">
            {turnosSiguientes.map((t) => (
              <div
                key={t.i_numero_turno}
                className="flex justify-between items-center bg-[#a7c08d] hover:bg-[#91ab78] text-white rounded shadow px-6 py-4"
              >
                <span className="text-5xl font-bold">{t.i_numero_turno}</span>
                <span className="text-lg font-medium">{t.s_area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Texto giratorio / publicidad */}
      <div className="bg-[#d5f2dd] overflow-hidden whitespace-nowrap">
        <p className="inline-block text-[#0d4633] font-bold text-sm md:text-base animate-marquee">
          Comisión Federal de Electricidad — Somos más que energía — Comisión
          Federal de Electricidad
        </p>
      </div>

      {/* Footer */}
      <div className="bg-[#1b3528] text-white text-xs text-center p-2">
        © ITZEL
      </div>
    </div>
  );
};

export default Dashboard;
