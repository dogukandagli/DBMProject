import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZG9ndWthbmRhZ2xpIiwiYSI6ImNtaTM3MWI5OTFlNm4ybXNmdm5idmo2dm0ifQ.mWkmdo2-w8z4XLtCxQ1P5g";

export default function HomePage() {
  // ⭐ Ref'e doğru tip ver
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ⭐ İlk render’da null olur → burada durdur
    if (!mapContainer.current) return;

    const center: [number, number] = [27.124324749601616, 38.384660158052355];
    const map = new mapboxgl.Map({
      container: mapContainer.current, // artık HTMLElement olarak doğru tipte
      style: "mapbox://styles/mapbox/light-v11",
      center,
      zoom: 12,
      attributionControl: false,
    });
    new mapboxgl.Marker().setLngLat(center).addTo(map);

    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: "© Mapbox © OpenStreetMap",
      }),
      "bottom-right"
    );

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
}
