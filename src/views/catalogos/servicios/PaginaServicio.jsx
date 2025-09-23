import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Esta función convierte el slug de la URL a un texto legible (ej: "pagos-y-convenios" -> "Pagos y convenios")
const deslugify = (slug) => {
    if (!slug) return '';
    const words = slug.split('-');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function PaginaServicio() {
    // Usamos useParams para obtener los parámetros de la URL
    const { slug } = useParams();
    const nombreServicio = deslugify(slug);

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Detalles del Servicio</h1>
            <h2 style={{ fontSize: '3rem', color: '#10B981' }}>
                {nombreServicio}
            </h2>
            <p>Aquí se mostraría la información o el formulario para "{nombreServicio}".</p>
            <br />

            {/* ▼▼▼ AQUÍ ESTÁ LA CORRECCIÓN ▼▼▼ */}
            <Link to="/catalogos/servicios/consulta/" style={{ textDecoration: 'none', color: '#fff', backgroundColor: '#333', padding: '10px 20px', borderRadius: '5px' }}>
                &larr; Volver a la consulta
            </Link>
        </div>
    );
}