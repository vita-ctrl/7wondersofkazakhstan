import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent(props) {
  return (
    <div className="font-['Inter']">
      <MapContainer
        style={{ height: props.height, width: "100%", zIndex: 0 }}
        center={[props.lat, props.long]}
        zoom={props.zoom}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[props.lat, props.long]}>
          <Popup>{props.popup}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
