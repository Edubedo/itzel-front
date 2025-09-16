import React, { useState, useEffect } from 'react';
import { Branch, BranchStatus } from '../types';
import FormularioSucursales from '../formulario/FormularioSucursales';

interface Municipio {
  id: string;
  nombre: string;
}

const datosInicialesDB: Branch[] = [
    { id: 'uuid-1', address: 'Av. Elías Zamora Verduzco #123', municipality: 'Manzanillo', status: BranchStatus.Open },
    { id: 'uuid-2', address: 'Blvd. Miguel de la Madrid #456', municipality: 'Manzanillo', status: BranchStatus.Closed },
    { id: 'uuid-3', address: 'Av. Insurgentes #500', municipality: 'Tecomán', status: BranchStatus.Open },
    { id: 'uuid-4', address: 'Av. de los Maestros #200', municipality: 'Colima', status: BranchStatus.Open },
    { id: 'uuid-5', address: 'Benito Juárez #150', municipality: 'Villa de Álvarez', status: BranchStatus.Open },
];

// --- Iconos SVG ---
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;

const ConsultaSucursales: React.FC = () => {
  const [allSucursales, setAllSucursales] = useState<Branch[]>(datosInicialesDB);
  const [sucursales, setSucursales] = useState<Branch[]>([]); 
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  useEffect(() => {
    // ✅ ¡AQUÍ ESTABA EL ERROR! Corregido a 'municipality'
    const nombresDeMunicipiosConSucursal = allSucursales.map(sucursal => sucursal.municipality);
    const municipiosUnicos = [...new Set(nombresDeMunicipiosConSucursal)];
    const municipiosParaSelector = municipiosUnicos.map(nombre => ({
      id: nombre.substring(0, 3).toUpperCase(),
      nombre: nombre,
    }));
    setMunicipios(municipiosParaSelector);
  }, [allSucursales]);

  const handleBuscar = () => {
    if (municipioSeleccionado) {
      const municipioSeleccionadoObj = municipios.find(m => m.id === municipioSeleccionado);
      if(municipioSeleccionadoObj) {
          const resultados = allSucursales.filter(sucursal => sucursal.municipality === municipioSeleccionadoObj.nombre);
          setSucursales(resultados);
      }
    }
  };
  
  const handleSave = (formData: Omit<Branch, 'id'>) => {
    let updatedAllSucursales: Branch[] = [];
    if (editingBranch) {
      updatedAllSucursales = allSucursales.map(s => s.id === editingBranch.id ? { ...formData, id: s.id } : s);
    } else {
      const nuevaSucursal: Branch = { ...formData, id: `uuid-${Date.now()}` };
      updatedAllSucursales = [...allSucursales, nuevaSucursal];
    }
    setAllSucursales(updatedAllSucursales);
    const municipioSeleccionadoObj = municipios.find(m => m.id === municipioSeleccionado);
    if(municipioSeleccionadoObj) {
        const resultados = updatedAllSucursales.filter(sucursal => sucursal.municipality === municipioSeleccionadoObj.nombre);
        setSucursales(resultados);
    }
    setIsFormVisible(false);
    setEditingBranch(null);
  };
  
  const handleDelete = (branchId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) {
        const updatedAllSucursales = allSucursales.filter(s => s.id !== branchId);
        setAllSucursales(updatedAllSucursales);
        setSucursales(prevResultados => prevResultados.filter(s => s.id !== branchId));
    }
  };

  const showForm = (branch: Branch | null) => {
    setEditingBranch(branch);
    setIsFormVisible(true);
  };

  if (isFormVisible) {
    return <FormularioSucursales branchToEdit={editingBranch} onSave={handleSave} onCancel={() => setIsFormVisible(false)} />;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Consulta de Sucursales</h1>
      
      {/* --- SECCIÓN DE BÚSQUEDA --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <div>
          <label className="text-sm font-medium text-gray-600">Estado</label>
          <input type="text" value="Colima" disabled className="w-full mt-1 p-2 border rounded bg-gray-100 cursor-not-allowed"/>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Municipio</label>
          <select value={municipioSeleccionado} onChange={(e) => setMunicipioSeleccionado(e.target.value)} className="w-full mt-1 p-2 border rounded">
            <option value="">Selecciona un municipio...</option>
            {municipios.map(municipio => <option key={municipio.id} value={municipio.id}>{municipio.nombre}</option>)}
          </select>
        </div>
        <div className="flex items-end">
            <button onClick={handleBuscar} disabled={!municipioSeleccionado} className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 hover:bg-green-700 transition-colors">
              <SearchIcon />
              Buscar
            </button>
        </div>
      </div>

      {/* --- SECCIÓN DE RESULTADOS --- */}
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Resultados</h2>
        <button onClick={() => showForm(null)} className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon />
          Nueva Sucursal
        </button>
      </header>
      
      {/* --- SECCIÓN DE RESULTADOS (AHORA CON TARJETAS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sucursales.map((sucursal) => (
          <div key={sucursal.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg text-gray-800">{sucursal.municipality}</p>
                  <p className="text-sm text-gray-600">{sucursal.address}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${sucursal.status === BranchStatus.Open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {sucursal.status}
                </span>
              </div>
              <div className="mt-6 flex justify-end items-center gap-2">
                  <button onClick={() => showForm(sucursal)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Editar">
                    <PencilIcon />
                  </button>
                  <button onClick={() => handleDelete(sucursal.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full" title="Eliminar">
                    <TrashIcon />
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
       {/* Mensaje si no hay resultados */}
       {sucursales.length === 0 && municipioSeleccionado && (
        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-700">Sin resultados</h3>
            <p className="text-gray-500 mt-1">No se encontraron sucursales para el municipio seleccionado.</p>
        </div>
       )}

    </div>
  );
};

export default ConsultaSucursales;