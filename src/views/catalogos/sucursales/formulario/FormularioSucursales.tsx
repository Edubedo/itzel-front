
import React, { useState, useEffect } from 'react'; 
import { Branch, BranchStatus } from '../types';


interface FormularioSucursalesProps {
  branchToEdit?: Branch | null;
  onSave: (branchData: Omit<Branch, 'id'>) => void;
  onCancel: () => void;
}


const FormularioSucursales: React.FC<FormularioSucursalesProps> = ({ branchToEdit, onSave, onCancel }) => {
  const isEditMode = Boolean(branchToEdit);

  const [formData, setFormData] = useState({
    address: '',
    municipality: '',
    status: BranchStatus.Open,
  });

  useEffect(() => {
    if (isEditMode && branchToEdit) {
      setFormData({
        address: branchToEdit.address,
        municipality: branchToEdit.municipality,
        status: branchToEdit.status,
      });
    }
  }, [isEditMode, branchToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? '✏️ Editando Sucursal' : '✨ Formulario de Sucursales'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
            <textarea
              id="address" name="address" value={formData.address} onChange={handleChange}
              rows={3} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">Municipio</label>
            <input
              type="text" id="municipality" name="municipality" value={formData.municipality} onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              id="status" name="status" value={formData.status} onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              {Object.values(BranchStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
              {isEditMode ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioSucursales;