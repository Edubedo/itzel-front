const SucursalesStatus = () => {
  const sucursales = [
    { nombre: "Sucursal Centro", estado: "Activa" },
    { nombre: "Sucursal Norte", estado: "Inactiva" },
    { nombre: "Sucursal Sur", estado: "Activa" },
  ];


  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Estado de Sucursales</h2>
      <ul className="space-y-2">
        {sucursales.map((suc, i) => (
          <li key={i} className="flex justify-between">
            <span>{suc.nombre}</span>
            <span
              className={`font-bold ${
                suc.estado === "Activa" ? "text-green-600" : "text-red-600"
              }`}
            >
              {suc.estado}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SucursalesStatus;
