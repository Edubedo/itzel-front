// dashboard.tsx   !!!!

import React, { useState, useEffect } from "react";
import { Clipboard, Volume2, Clock } from "lucide-react";

const Dashboard: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval); // limpiar cuando se desmonte
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

  let consultaAPI = [
    {
      numeroTURNO: 82,    //hacer validacion para que no aparezcan lo turnos pasados (FINALI)
      modulo: "A1",
      estado: "FINALI",
      prioritario: true,
    },
     {
      numeroTURNO: 83,
      modulo: "A5",
      estado: "ATENDI",
      prioritario: false

    },
     {
      numeroTURNO: 84,
      modulo: "A3",
      estado: "ACTIVO",
      prioritario: false
    },
     {
      numeroTURNO: 85,
      modulo: "A2",
      estado: "ACTIVO",
      prioritario: true
    }
  ]
  console.log("consultaAPI; ", consultaAPI)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-[#1b3528] text-white px-4 py-2">
        <span className="text-sm md:text-base">Manzanillo, Colima</span>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <div className="text-right leading-tight">
            <div className="text-sm md:text-base font-semibold">{formattedTime}</div>
            <div className="text-xs md:text-sm">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 p-3">
        {/* Columna IZQUIERDA */}
        <div className="grid grid-rows-[auto_1fr_auto] gap-3">
          {/* TURNO */}
          <div className="flex justify-between items-center bg-[#E8E1C0] p-3 rounded-md shadow">
            <h2 className="text-2xl font-bold">TURNO</h2>
            <span className="text-lg">🔄</span>
          </div>

          {/* Número de turno */}
          <div className="flex items-center justify-center bg-[#E1EBCF] rounded-md shadow">
            <span className="text-7xl md:text-8xl font-bold">
              {
                consultaAPI.map(e=>{
                  if(e.estado=="ATENDI"){
                    return(
                    <>
                      {e.numeroTURNO}
                    </>
                  )
                  }
                })
              }
            </span>
          </div>

          {/* Módulo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col justify-center items-center bg-[#E8E1C0] rounded-md shadow p-2">
              <span className="text-sm font-semibold">MÓDULO</span>
              <Volume2 className="w-6 h-6 mt-1" />
            </div>
            <div className="flex items-center justify-center bg-[#E1EBCF] rounded-md shadow">
              <span className="text-3xl md:text-4xl font-bold">A1</span>
            </div>
          </div>
        </div>

        {/* Columna DERECHA */}
        <div className="flex flex-col gap-3">
          {/* Encabezado turnos */}
          <div className="flex justify-between items-center bg-[#E8E1C0] p-3 rounded-md shadow">
            <h2 className="text-2xl font-bold">TURNOS</h2>
            <Clipboard className="w-5 h-5" />
          </div>

          {/* Lista de turnos */}
          <div className="grid grid-rows-3 gap-3">
            {consultaAPI.map((t, i) => {
              if(t.estado !== 'ATENDI') {
                return (
                <div
                key={i}
                className="flex justify-between items-center bg-[#E1EBCF] rounded-md shadow px-4 py-3"
              >3
                <span className="text-5xl font-bold">{t.numeroTURNO}</span>
                <span className="text-lg font-medium">{t.modulo}</span>
              </div>
              )
              } 
              
            })}
          </div>
        </div>
      </div>

      {/* Texto giratorio / publicidad */}
      <div className="bg-[#d5f2dd] overflow-hidden whitespace-nowrap">
        <p className="inline-block text-[#0d4633] font-bold text-sm md:text-base animate-marquee">
          Comisión Federal de Electricidad    —    Somos más que energia    —    Comision Federal de Electricidad
        </p>
      </div>

      {/* Footer */}
      <div className="bg-[#1b3528] text-white text-xs text-left p-2 pl-4">
        © ITZEL
      </div>
    </div>
  );
};

export default Dashboard;
