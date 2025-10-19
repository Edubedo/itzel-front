import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Alert from "../../../../components/ui/alert/Alert";
import { serviciosService, ServicioFormData, Servicio } from "../../../../services/serviciosService";
import { areasService, Area } from "../../../../services/areasService";

function FormularioServicios() {
  const [formData, setFormData] = useState<ServicioFormData>({
    s_servicio: "",
    s_descripcion_servicio: "",
    ck_area: "",
    c_codigo_servicio: "",
    ck_estatus: "ACTIVO",
    i_es_para_clientes: 1,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedAreaSucursal, setSelectedAreaSucursal] = useState("");

  // Estados para alertas - IGUAL QUE FORMULARIO AREAS
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const servicioId = urlParams.get("id");

      if (servicioId) {
        setIsEditing(true);
        fetchServicioData(servicioId);
      }
    }

    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setLoadingAreas(true);
      console.log("Cargando áreas...");
      
      const response = await areasService.getAreas();
      console.log("Respuesta de áreas:", response);
      
      if (response.success) {
        console.log("Datos de áreas cargados:", response.data);
        setAreas(response.data);
        
        if (isEditing && formData.ck_area) {
          const areaSeleccionada = response.data.find((area: Area) => area.ck_area === formData.ck_area);
          if (areaSeleccionada) {
            setSelectedAreaSucursal(areaSeleccionada.sucursal_nombre || "N/A");
          }
        }
      } else {
        console.error("Error en respuesta de áreas:", response);
        alert("Error al cargar las áreas: " + response.message);
      }
    } catch (error: any) {
      console.error("Error al cargar las áreas:", error);
      alert("Error al cargar las áreas: " + error.message);
    } finally {
      setLoadingAreas(false);
    }
  };

  const fetchServicioData = async (id: string) => {
    try {
      setLoading(true);
      console.log("Cargando datos del servicio:", id);
      
      const response = await serviciosService.getServicioById(id);
      console.log("Respuesta del servicio:", response);

      if (response.success) {
        const servicio: Servicio = response.data;
        console.log("Datos del servicio a cargar:", servicio);
        
        setFormData({
          s_servicio: servicio.s_servicio || "",
          s_descripcion_servicio: servicio.s_descripcion_servicio || "",
          ck_area: servicio.ck_area || "",
          c_codigo_servicio: servicio.c_codigo_servicio || "",
          ck_estatus: servicio.ck_estatus || "ACTIVO",
          i_es_para_clientes: servicio.i_es_para_clientes !== undefined ? servicio.i_es_para_clientes : 1,
        });

        if (servicio.ck_area && areas.length > 0) {
          const areaSeleccionada = areas.find(area => area.ck_area === servicio.ck_area);
          if (areaSeleccionada) {
            setSelectedAreaSucursal(areaSeleccionada.sucursal_nombre || "N/A");
          }
        }
      } else {
        alert("Error al cargar datos del servicio: " + response.message);
      }
    } catch (error: any) {
      console.error("Error al cargar datos del servicio:", error);
      alert("Error al cargar datos del servicio: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof ServicioFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "ck_area") {
      const areaSeleccionada = areas.find(area => area.ck_area === value);
      setSelectedAreaSucursal(areaSeleccionada?.sucursal_nombre || "N/A");
    }

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.s_servicio.trim()) {
      newErrors.s_servicio = "El nombre del servicio es requerido";
    }

    if (!formData.c_codigo_servicio.trim()) {
      newErrors.c_codigo_servicio = "El código del servicio es requerido";
    }

    if (!formData.ck_area) {
      newErrors.ck_area = "El área es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Por favor, corrija los errores en el formulario');
      return;
    }

    try {
      setLoading(true);
      console.log("Enviando datos:", formData);

      let response;
      if (isEditing && typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const servicioId = urlParams.get("id");
        response = await serviciosService.updateServicio(servicioId!, formData);
      } else {
        response = await serviciosService.createServicio(formData);
      }

      console.log("Respuesta del servidor:", response);

      if (response.success) {
        setShowSuccess(true);
        setSuccessMessage(
          isEditing 
            ? "Servicio actualizado correctamente" 
            : "Servicio creado correctamente"
        );

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/catalogos/servicios/consulta/";
          }
        }, isEditing ? 1300 : 1300); 
      } else {
        alert("Error al guardar el servicio: " + response.message);
      }
    } catch (error: any) {
      console.error("Error al guardar el servicio:", error);
      alert("Error al guardar el servicio: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/catalogos/servicios/consulta/";
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando datos del servicio...</span>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title={isEditing ? "Editar Servicio - Sistema de Turnos" : "Crear Servicio - Sistema de Turnos"}
        description="Formulario para gestionar servicios del sistema"
      />

      <PageBreadcrumb pageTitle={isEditing ? "Editar Servicio" : "Crear Nuevo Servicio"} />

      {/* ALERTA DE ÉXITO */}
      {showSuccess && (
        <div className="mb-8 mt-2">
          <Alert
            variant="success"
            title="¡Operación exitosa!"
            message={successMessage}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <ComponentCard title="Información del Servicio">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Nombre del Servicio <span className="text-red-500 text-sm">*</span></Label>
                <Input
                  type="text"
                  value={formData.s_servicio}
                  onChange={(e) => handleInputChange("s_servicio", e.target.value)}
                  placeholder="Ej. Cobro de facturas"
                  className={errors.s_servicio ? "border-red-500" : ""}
                />
                {errors.s_servicio && (
                  <p className="text-red-500 text-sm mt-1">{errors.s_servicio}</p>
                )}
              </div>

              <div>
                <Label>Código del Servicio <span className="text-red-500 text-sm">*</span></Label>
                <Input
                  type="text"
                  value={formData.c_codigo_servicio}
                  onChange={(e) => handleInputChange("c_codigo_servicio", e.target.value)}
                  placeholder="Ej. SVC-001"
                  className={errors.c_codigo_servicio ? "border-red-500" : ""}
                />
                {errors.c_codigo_servicio && (
                  <p className="text-red-500 text-sm mt-1">{errors.c_codigo_servicio}</p>
                )}
              </div>

              {/* ¿Es para clientes? */}
              <div>
                <Label>¿Es para clientes o no clientes? <span className="text-red-500 text-sm">*</span></Label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="es_para_clientes"
                      value="1"
                      checked={formData.i_es_para_clientes === 1}
                      onChange={(e) => handleInputChange("i_es_para_clientes", parseInt(e.target.value))}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Clientes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="es_para_clientes"
                      value="0"
                      checked={formData.i_es_para_clientes === 0}
                      onChange={(e) => handleInputChange("i_es_para_clientes", parseInt(e.target.value))}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No clientes</span>
                  </label>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Selecciona si este servicio es para clientes o no clientes.
                </p>
              </div>

              {/* Área con información de sucursal */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Área <span className="text-red-500 text-sm">*</span></Label>
                    {loadingAreas ? (
                      <div className="px-4 py-2 border border-gray-300 rounded-lg text-gray-500 bg-gray-100">
                        Cargando áreas...
                      </div>
                    ) : (
                      <select
                        value={formData.ck_area}
                        onChange={(e) => handleInputChange("ck_area", e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${errors.ck_area ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">Seleccione un área</option>
                        {areas.map((area) => (
                          <option key={area.ck_area} value={area.ck_area}>
                            {area.s_area} - {area.sucursal_nombre || "Sin sucursal"}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.ck_area && (
                      <p className="text-red-500 text-sm mt-1">{errors.ck_area}</p>
                    )}
                    {areas.length === 0 && !loadingAreas && (
                      <p className="text-yellow-600 text-sm mt-1">
                        No hay áreas disponibles. Por favor, cree áreas primero.
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Sucursal del Área</Label>
                    <div className={`px-4 py-2 border rounded-lg ${
                      selectedAreaSucursal ? "border-gray-300 bg-gray-50 text-gray-700" : "border-gray-200 bg-gray-100 text-gray-500"
                    }`}>
                      {selectedAreaSucursal || "Seleccione un área"}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Sucursal a la que pertenece el área seleccionada
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Estado</Label>
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ck_estatus === "ACTIVO"}
                      onChange={(e) =>
                        handleInputChange("ck_estatus", e.target.checked ? "ACTIVO" : "INACTIVO")
                      }
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {formData.ck_estatus === "ACTIVO" ? "Activo" : "Inactivo"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label>Descripción del Servicio</Label>
              <textarea
                value={formData.s_descripcion_servicio}
                onChange={(e) => handleInputChange("s_descripcion_servicio", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 resize-vertical"
                placeholder="Detalles adicionales del servicio..."
              />
            </div>
          </ComponentCard>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar Servicio' : 'Crear Servicio')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioServicios;