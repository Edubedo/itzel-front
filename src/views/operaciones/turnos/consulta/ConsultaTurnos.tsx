import React, { useEffect, useState } from "react";
import { ClipboardList, CheckCircle } from "lucide-react";

function ConsultaTurnos() {
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [turnoActual, setTurnoActual] = useState(null);
  const [proximos, setProximos] = useState([]);

  // Cargar sucursales
  useEffect(() => {
    fetch("http://localhost:3001/api/sucursales")
      .then((res) => res.json())
      .then((data) => {
        setSucursales(data);
        if (data.length > 0) {
          setSucursalSeleccionada(data[0].ck_sucursal); // por default primera
        }
      });
  }, []);

  // Cargar turnos cuando cambie sucursal
  useEffect(() => {
    if (!sucursalSeleccionada) return;

    fetch(`http://localhost:3001/api/turnos/actual/${sucursalSeleccionada}`)
      .then((res) => res.json())
      .then((data) => setTurnoActual(data));

    fetch(`http://localhost:3001/api/turnos/proximos/${sucursalSeleccionada}`)
      .then((res) => res.json())
      .then((data) => setProximos(data));
  }, [sucursalSeleccionada]);

  // Funciones para botones
  const atenderTurno = (id) => {
    fetch(`http://localhost:3001/api/turnos/atender/${id}`, { method: "POST" })
      .then(() => {
        setTurnoActual(proximos[0] || null);
        setProximos(proximos.slice(1));
      });
  };

  const terminarTurno = (id) => {
    fetch(`http://localhost:3001/api/turnos/terminar/${id}`, { method: "POST" })
      .then(() => setTurnoActual(null));
  };

  const finalizarAtencion = (id) => {
    fetch(`http://localhost:3001/api/turnos/finalizar/${id}`, { method: "POST" })
      .then(() => setTurnoActual(null));
  };

  return (
    <div className="text-[24px]">
      {/* Encabezado  */}
      <div className="flex justify-between items-center">
        <h1 className="text-[24px] font-bold">Consulta de Turnos</h1>
        <div className="flex items-center">
          <label className="mr-2">Sucursal:</label>
          <select
            className="border px-20 py-2 rounded-lg"
            value={sucursalSeleccionada || ""}
            onChange={(e) => setSucursalSeleccionada(e.target.value)}
          >
            {sucursales.map((s) => (
              <option key={s.ck_sucursal} value={s.ck_sucursal}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="min-h-screen bg-white flex flex-col items-center justify-start p-6 mt-12">
        {/* Botones */}
        <div className="flex space-x-6 mb-15">
          <button
            onClick={() => turnoActual && atenderTurno(turnoActual.ck_turno)}
            className="bg-[#22AE69] hover:bg-[#20955B] text-white font-medium px-6 py-3 rounded-xl shadow-md w-64 text-[20px] mt-10"
          >
            Atender turno actual
          </button>
          <button
            onClick={() => turnoActual && terminarTurno(turnoActual.ck_turno)}
            className="bg-[#6b8f73] hover:bg-[#54705b] text-white font-medium px-6 py-3 rounded-xl shadow-md w-64 text-[20px] mt-10"
          >
            Terminar turno actual
          </button>
          <button
            onClick={() => turnoActual && finalizarAtencion(turnoActual.ck_turno)}
            className="bg-[#5f8b67] hover:bg-[#47664c] text-white font-bold px-6 py-3 rounded-xl shadow-md w-64 text-[15px] mt-10"
          >
            FINALIZAR ATENCIÓN
          </button>
        </div>

        <div className="flex gap-10">
          {/* Tarjeta turno actual */}
          <div className="bg-[#C5D5C8] rounded-xl shadow-xl p-10 w-[40rem] h-[33rem] flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 text-[60px]">
              TURNO ACTUAL
            </h2>
            {turnoActual ? (
              <>
                <p className="text-7xl font-extrabold text-green-900 mb-4">
                  {turnoActual.i_numero_turno}
                </p>
                <p className="text-2xl font-semibold text-gray-700 mb-8">
                  {turnoActual.ck_area}
                </p>
              </>
            ) : (
              <p className="text-2xl text-gray-600">No hay turno en curso</p>
            )}
            <div className="relative">
              <ClipboardList className="w-30 h-30 text-green-900" />
              <CheckCircle className="w-10 h-10 text-green-700 absolute -bottom-4 -right-6" />
            </div>
          </div>

          {/* Lista de próximos turnos */}
          <div className="flex flex-col gap-6">
            {proximos.length > 0 ? (
              proximos.map((t) => (
                <div
                  key={t.ck_turno}
                  className="bg-[#E8F0E8] rounded-lg shadow-md p-2 w-55 flex flex-col items-center"
                >
                  <p className="text-sm text-gray-600 text-[20px]">
                    Próximo Turno
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {t.i_numero_turno}
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {t.ck_area}
                  </p>
                  <ClipboardList className="w-10 h-10 text-green-900 mt-2" />
                  <CheckCircle className="w-4 h-4 text-green-700 mt-1" />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No hay próximos turnos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultaTurnos;
