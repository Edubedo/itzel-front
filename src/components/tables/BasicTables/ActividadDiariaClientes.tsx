import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Contratación", clientes: 2, nuevos: 10 },
  { name: "Facturación", clientes: 20, nuevos: 20 },
  { name: "Pago", clientes: 25, nuevos: 45 },
  { name: "Reporte", clientes: 12, nuevos: 50 },
];

export default function ActividadDiariaClientes() {
  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-white/[0.05] dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Actividad diaria de clientes
      </h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorClientes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="clientes"
              stroke="#0088FE"
              fill="url(#colorClientes)"
            />
            <Area
              type="monotone"
              dataKey="nuevos"
              stroke="#00C49F"
              fill="url(#colorNuevos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
