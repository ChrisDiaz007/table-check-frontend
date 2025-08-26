import { useEffect, useMemo, useRef } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "../../../App.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView({ markers = [], height = 400 }) {
  const mapRef = useRef(null);

  // Initial center
  const initial = useMemo(() => {
    const first = markers[0];
    return {
      longitude: first ? Number(first.longitude) : 139.6917, // Tokyo fallback
      latitude: first ? Number(first.latitude) : 35.6895,
      zoom: 12,
    };
  }, [markers]);

  // Auto-fit bounds if multiple markers
  useEffect(() => {
    if (!mapRef.current || markers.length < 2) return;
    const lons = markers.map((m) => Number(m.longitude));
    const lats = markers.map((m) => Number(m.latitude));
    const minLon = Math.min(...lons),
      maxLon = Math.max(...lons);
    const minLat = Math.min(...lats),
      maxLat = Math.max(...lats);
    if (minLon === maxLon && minLat === maxLat) return;
    mapRef.current.fitBounds(
      [
        [minLon, minLat],
        [maxLon, maxLat],
      ],
      { padding: 60 }
    );
  }, [markers]);

  return (
    <div style={{ width: "100%", height }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initial}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
      >
        {markers.map((m, i) => (
          <Marker
            key={i}
            latitude={Number(m.latitude)}
            longitude={Number(m.longitude)}
            anchor="bottom"
          >
            <div style={{ textAlign: "center" }}>
              <img
                src={m.photo_url}
                alt={m.name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "2px solid white",
                  objectFit: "cover",
                  boxShadow: "0 0 6px rgba(0,0,0,.4)",
                }}
              />
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderTop: "12px solid #800080", // red pointer
                  margin: "0 auto",
                }}
              />
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
