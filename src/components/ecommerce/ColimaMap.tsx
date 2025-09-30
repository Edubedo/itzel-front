// src/components/ecommerce/ColimaMap.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Corrección: Leaflet requiere definir un ícono porque el default no carga bien en React
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface Branch {
  name: string;
  coords: [number, number]; // [latitud, longitud]
  customers: number;
}

const branches: Branch[] = [
  { name: "Centro", coords: [19.243, -104.335], customers: 1200 },
  { name: "Salagua", coords: [19.110, -104.325], customers: 800 },
  // agrega más sucursales
];

export default function ColimaMap() {
  return (
    <MapContainer
      center={[19.2, -104.2]} // Centro aproximado del estado de Colima
      zoom={10}
      style={{ height: "220px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {branches.map((b) => (
        <Marker key={b.name} position={b.coords} icon={markerIcon}>
          <Popup>
            <strong>{b.name}</strong> <br />
            {b.customers} clientes
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
