'use client'

import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'

const hubs = [
  { name: 'Chisinau Hub', position: [47.0105, 28.8638] as [number, number] },
  { name: 'Warsaw Hub', position: [52.2297, 21.0122] as [number, number] },
  { name: 'Kyiv Hub', position: [50.4501, 30.5234] as [number, number] }
]

export const OperationsMap = () => (
  <div className="dashboard-card__map">
    <MapContainer center={[49.2, 26.3]} zoom={5} scrollWheelZoom={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {hubs.map((hub) => (
        <CircleMarker key={hub.name} center={hub.position} radius={9} pathOptions={{ fillOpacity: 0.85 }}>
          <Popup>{hub.name}</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  </div>
)
