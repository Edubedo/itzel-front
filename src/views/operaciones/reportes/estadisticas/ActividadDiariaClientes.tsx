// ReportesAdmin.tsx
import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  Building, 
  Clock, 
  Filter,
  Download,
  Calendar,
  TrendingUp
} from "lucide-react";
import { useSucursalActiva } from '../../../../components/header/Header';
import { useAuth } from '../../../../contexts/AuthContext';

// Interfaces
interface FiltrosReporte {
  fechaInicio: string;
  fechaFin: string;
  sucursalId: string;
  areaId: string;
  servicioId: string;
  usuarioId: string;
  tipoCliente: string;
}

interface EstadisticasGenerales {
  totalTurnos: number;
  turnosAtendidos: number;
  turnosPendientes: number;
  tiempoPromedioEspera: number;
  tiempoPromedioAtencion: number;
  clientesNuevos: number;
  clientesRecurrentes: number;
}

interface TurnoPorHora {
  hora: string;
  turnos: number;
  atendidos: number;
}

interface TurnoPorMes {
  mes: string;
  turnos: number;
  atendidos: number;
}

// Componente de Filtros
const FiltrosReportes: React.FC<{
  filtros: FiltrosReporte;
  onFiltrosChange: (filtros: FiltrosReporte) => void;
}> = ({ filtros, onFiltrosChange }) => {
  const [areas, setAreas] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  
  // Obtener fecha actual para establecer rangos por defecto
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 2)
    .toISOString().split('T')[0];

  const handleFilterChange = (key: keyof FiltrosReporte, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[#70A18E]" />
        <h3 className="text-lg font-semibold text-gray-800">Filtros de Reporte</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fecha Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A18E] focus:border-transparent"
          />
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Fin
          </label>
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A18E] focus:border-transparent"
          />
        </div>

        {/* Sucursal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sucursal
          </label>
          <select
            value={filtros.sucursalId}
            onChange={(e) => handleFilterChange('sucursalId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A18E] focus:border-transparent"
          >
            <option value="">Todas las sucursales</option>
            {/* Aquí mapearías las sucursales */}
          </select>
        </div>

        {/* Área */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Área
          </label>
          <select
            value={filtros.areaId}
            onChange={(e) => handleFilterChange('areaId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A18E] focus:border-transparent"
          >
            <option value="">Todas las áreas</option>
            <option value="contabilidad">Contabilidad</option>
            <option value="conexiones">Conexiones</option>
            <option value="recursos-humanos">Recursos Humanos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Servicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servicio
          </label>
          <select
            value={filtros.servicioId}
            onChange={(e) => handleFilterChange('servicioId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A18E] focus:border-transparent"
          >
            <option value="">Todos los servicios</option>
            <option value="pago">Pago de servicio</option>
            <option value="contratacion">Contratación</option>
            <option value="reporte">Reporte de fallas</option>
          </select>
        </div>

        {/* Tipo de Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Cliente
          </label>
          <select
            value={filtros.tipoCliente}
            onChange={(e) => handleFilterChange('tipoCliente', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A18E] focus:border-transparent"
          >
            <option value="">Todos los clientes</option>
            <option value="nuevo">Clientes nuevos</option>
            <option value="recurrente">Clientes recurrentes</option>
          </select>
        </div>

        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <select
            value={filtros.usuarioId}
            onChange={(e) => handleFilterChange('usuarioId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A18E] focus:border-transparent"
          >
            <option value="">Todos los usuarios</option>
            {/* Aquí mapearías los usuarios */}
          </select>
        </div>
      </div>
    </div>
  );
};

// Componente de Estadísticas Generales
const EstadisticasGenerales: React.FC<{ datos: EstadisticasGenerales }> = ({ datos }) => {
  const cards = [
    {
      titulo: "Total Turnos",
      valor: datos.totalTurnos,
      icono: BarChart3,
      color: "from-[#B7F2DA] to-[#8ECAB2]",
      texto: "text-[#3A554B]"
    },
    {
      titulo: "Turnos Atendidos",
      valor: datos.turnosAtendidos,
      icono: Users,
      color: "from-[#8ECAB2] to-[#70A18E]",
      texto: "text-[#3A554B]"
    },
    {
      titulo: "Tiempo Promedio",
      valor: `${datos.tiempoPromedioAtencion} min`,
      icono: Clock,
      color: "from-[#70A18E] to-[#547A6B]",
      texto: "text-white"
    },
    {
      titulo: "Clientes Nuevos",
      valor: datos.clientesNuevos,
      icono: TrendingUp,
      color: "from-[#547A6B] to-[#3A554B]",
      texto: "text-white"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${card.color} rounded-xl shadow-lg p-6 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{card.titulo}</p>
              <p className={`text-2xl font-bold mt-2 ${card.texto}`}>
                {card.valor}
              </p>
            </div>
            <card.icono className="w-8 h-8 opacity-80" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de Gráfica de Turnos por Hora
const TurnosPorHora: React.FC<{ datos: TurnoPorHora[] }> = ({ datos }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#70A18E]" />
          Turnos por Hora del Día
        </h3>
      </div>
      
      <div className="h-64">
        <div className="flex flex-col h-full">
          {datos.map((hora, index) => (
            <div key={index} className="flex items-center mb-3">
              <span className="w-16 text-sm text-gray-600">{hora.hora}</span>
              <div className="flex-1 ml-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{hora.turnos} turnos</span>
                  <span>{hora.atendidos} atendidos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#70A18E] to-[#547A6B] h-3 rounded-full"
                    style={{
                      width: `${(hora.atendidos / hora.turnos) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente de Gráfica de Turnos por Mes
const TurnosPorMes: React.FC<{ datos: TurnoPorMes[] }> = ({ datos }) => {
  const maxTurnos = Math.max(...datos.map(d => d.turnos));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#70A18E]" />
          Turnos por Mes
        </h3>
      </div>
      
      <div className="h-64">
        <div className="flex items-end justify-between h-full space-x-2">
          {datos.map((mes, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="text-xs text-gray-600 mb-2">{mes.mes}</div>
              <div className="flex flex-col items-center w-full">
                <div
                  className="w-full bg-gradient-to-t from-[#70A18E] to-[#8ECAB2] rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(mes.turnos / maxTurnos) * 80}%`,
                    minHeight: '20px'
                  }}
                ></div>
                <div className="text-xs text-gray-700 mt-1">
                  {mes.turnos}
                </div>
                <div className="text-xs text-[#547A6B]">
                  {mes.atendidos} at.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente de Distribución por Áreas
const DistribucionAreas: React.FC<{ datos: any[] }> = ({ datos }) => {
  const total = datos.reduce((sum, area) => sum + area.turnos, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Building className="w-5 h-5 text-[#70A18E]" />
        Distribución por Áreas
      </h3>
      
      <div className="space-y-4">
        {datos.map((area, index) => {
          const porcentaje = ((area.turnos / total) * 100).toFixed(1);
          const colors = [
            'bg-[#B7F2DA]',
            'bg-[#8ECAB2]',
            'bg-[#70A18E]',
            'bg-[#547A6B]'
          ];
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {area.nombre}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${colors[index % colors.length]}`}
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {porcentaje}%
                </span>
                <span className="text-sm font-semibold text-gray-800 w-8">
                  {area.turnos}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Componente Principal
function ReportesAdmin() {
  const { user } = useAuth();
  const sucursalActiva = useSucursalActiva();
  
  const [filtros, setFiltros] = useState<FiltrosReporte>({
    fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    sucursalId: '',
    areaId: '',
    servicioId: '',
    usuarioId: '',
    tipoCliente: ''
  });

  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales>({
    totalTurnos: 0,
    turnosAtendidos: 0,
    turnosPendientes: 0,
    tiempoPromedioEspera: 0,
    tiempoPromedioAtencion: 0,
    clientesNuevos: 0,
    clientesRecurrentes: 0
  });

  const [turnosPorHora, setTurnosPorHora] = useState<TurnoPorHora[]>([]);
  const [turnosPorMes, setTurnosPorMes] = useState<TurnoPorMes[]>([]);
  const [distribucionAreas, setDistribucionAreas] = useState<any[]>([]);

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    cargarDatosReportes();
  }, [filtros]);

  const cargarDatosReportes = async () => {
    // Simulación de datos - en producción harías llamadas a tu API
    setEstadisticas({
      totalTurnos: 156,
      turnosAtendidos: 142,
      turnosPendientes: 14,
      tiempoPromedioEspera: 8.5,
      tiempoPromedioAtencion: 12.3,
      clientesNuevos: 23,
      clientesRecurrentes: 119
    });

    setTurnosPorHora([
      { hora: "08:00", turnos: 15, atendidos: 14 },
      { hora: "09:00", turnos: 22, atendidos: 21 },
      { hora: "10:00", turnos: 28, atendidos: 26 },
      { hora: "11:00", turnos: 25, atendidos: 24 },
      { hora: "12:00", turnos: 20, atendidos: 19 },
      { hora: "13:00", turnos: 18, atendidos: 17 },
      { hora: "14:00", turnos: 16, atendidos: 15 },
      { hora: "15:00", turnos: 12, atendidos: 12 }
    ]);

    setTurnosPorMes([
      { mes: "Ene", turnos: 120, atendidos: 115 },
      { mes: "Feb", turnos: 135, atendidos: 128 },
      { mes: "Mar", turnos: 142, atendidos: 136 },
      { mes: "Abr", turnos: 156, atendidos: 142 },
      { mes: "May", turnos: 148, atendidos: 140 },
      { mes: "Jun", turnos: 165, atendidos: 158 }
    ]);

    setDistribucionAreas([
      { nombre: "Contabilidad", turnos: 45 },
      { nombre: "Conexiones", turnos: 38 },
      { nombre: "Recursos Humanos", turnos: 32 },
      { nombre: "Atención General", turnos: 41 }
    ]);
  };

  const exportarReporte = () => {
    // Lógica para exportar reporte
    console.log("Exportando reporte con filtros:", filtros);
  };

  if (!sucursalActiva) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            No hay sucursal seleccionada
          </div>
          <p className="text-gray-600">
            Por favor seleccione una sucursal en el menú superior.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-[#70A18E]" />
              Reportes y Estadísticas
            </h1>
            <p className="text-gray-600">
              Sucursal: {sucursalActiva.s_nombre_sucursal}
            </p>
          </div>
          
          <button
            onClick={exportarReporte}
            className="flex items-center gap-2 bg-[#70A18E] hover:bg-[#547A6B] text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosReportes 
        filtros={filtros} 
        onFiltrosChange={setFiltros} 
      />

      {/* Estadísticas Generales */}
      <EstadisticasGenerales datos={estadisticas} />

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TurnosPorHora datos={turnosPorHora} />
        <DistribucionAreas datos={distribucionAreas} />
      </div>

      {/* Turnos por Mes */}
      <TurnosPorMes datos={turnosPorMes} />

      {/* Información adicional */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Resumen del Período
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Período analizado:</strong><br />
            {new Date(filtros.fechaInicio).toLocaleDateString('es-MX')} - {new Date(filtros.fechaFin).toLocaleDateString('es-MX')}
          </div>
          <div>
            <strong>Eficiencia de atención:</strong><br />
            {estadisticas.totalTurnos > 0 ? 
              `${((estadisticas.turnosAtendidos / estadisticas.totalTurnos) * 100).toFixed(1)}%` : 
              '0%'
            }
          </div>
          <div>
            <strong>Tasa de clientes nuevos:</strong><br />
            {estadisticas.totalTurnos > 0 ? 
              `${((estadisticas.clientesNuevos / estadisticas.totalTurnos) * 100).toFixed(1)}%` : 
              '0%'
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportesAdmin;