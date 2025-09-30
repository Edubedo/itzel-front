const TopUsuarios = () => {
  const usuarios = [
    { nombre: "Luis Pérez", turnos: 34 },
    { nombre: "Ana Gómez", turnos: 28 },
    { nombre: "Carlos Ríos", turnos: 22 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Top Usuarios</h2>
      <ul className="space-y-2">
        {usuarios.map((u, i) => (
          <li key={i} className="flex justify-between">
            <span>{u.nombre}</span>
            <span className="font-bold">{u.turnos}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopUsuarios;
