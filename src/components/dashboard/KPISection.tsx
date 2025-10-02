const KPISection = () => {
  const data = [
    { label: "Turnos Hoy", value: 124 },
    { label: "Tiempo Promedio", value: "3m 42s" },
    { label: "Clientes Atendidos", value: 98 },
    { label: "Sucursales Activas", value: 5 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 text-sm">{item.label}</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPISection;
