
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import { serviciosService, ServicioFormData, Servicio } from "../../../../services/serviciosService";
import { areasService, Area } from "../../../../services/areasService";

function FormularioServicios() {
  const [formData, setFormData] = useState<ServicioFormData>({
    s_servicio: "",
    s_descripcion_servicio: "",
    ck_area: "",
    c_codigo_servicio: "",
    ck_estatus: "ACTIVO",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [areas, setAreas] = useState<Area[]>([]);

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
      const response = await areasService.getAreas();
      if (response.success) {
        setAreas(response.data);
      }
    } catch (error) {
      console.error("Error al cargar las áreas:", error);
    }
  };

  const fetchServicioData = async (id: string) => {
    try {
      setLoading(true);
      const response = await serviciosService.getServicioById(id);

      if (response.success) {
        const servicio: Servicio = response.data;
        setFormData({
          s_servicio: servicio.s_servicio,
          s_descripcion_servicio: servicio.s_descripcion_servicio || "",
          ck_area: servicio.ck_area,
          c_codigo_servicio: servicio.c_codigo_servicio,
          ck_estatus: servicio.ck_estatus,
        });
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
      alert("Por favor, corrija los errores en el formulario");
      return;
    }

    try {
      setLoading(true);

      let response;
      if (isEditing && typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const servicioId = urlParams.get("id");
        response = await serviciosService.updateServicio(servicioId!, formData);
      } else {
        response = await serviciosService.createServicio(formData);
      }

      if (response.success) {
        alert(isEditing ? "Servicio actualizado correctamente" : "Servicio creado correctamente");
        if (typeof window !== "undefined") {
          window.location.href = "/catalogos/servicios/consulta/";
        }
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

              <div>
                <Label>Área <span className="text-red-500 text-sm">*</span></Label>
                <select
                  value={formData.ck_area}
                  onChange={(e) => handleInputChange("ck_area", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.ck_area ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Seleccione un área</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.s_area}
                    </option>
                  ))}
                </select>
                {errors.ck_area && (
                  <p className="text-red-500 text-sm mt-1">{errors.ck_area}</p>
                )}
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
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {loading ? "Guardando..." : isEditing ? "Actualizar Servicio" : "Crear Servicio"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioServicios;
