import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "./MapMarker.css"; // CSS dosyasını import et
import { useAppSelector } from "../../app/store/hooks";

// Mapbox Token'ını buraya veya .env dosyasına koymalısın
mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX;

interface MapProps {
  center: [number, number]; // [Boylam, Enlem]
  status: string; // "pendingVerifyLocation", "successVerifyLocation", vs.
  address?: string; // Baloncukta yazacak adres
}

const MapWithStatusMarker: React.FC<MapProps> = ({
  center,
  status,
  address,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerIconRef = useRef<HTMLDivElement | null>(null);
  const verifyLocation = useAppSelector((state) => state.auth.verifyLocation);

  // Status Durumları
  const isPending = status === "pendingVerifyLocation";

  // 1. Haritayı ve Marker'ı Oluştur (Sadece ilk açılışta veya koordinat değişirse)
  useEffect(() => {
    if (!mapContainer.current) return;

    // Harita zaten varsa ve merkez aynıysa tekrar render etme (Performans için)
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: center,
      zoom: 16,
      attributionControl: false,
    });

    // --- Marker Oluşturma ---
    const el = document.createElement("div");
    el.className = "custom-marker-container";

    // İkon Alanı
    const iconSpan = document.createElement("div");
    iconSpan.className = "marker-icon";
    iconSpan.innerHTML = '<div class="loading-spinner"></div>'; // Default
    markerIconRef.current = iconSpan; // Ref'e kaydet

    // Metin Alanı
    const textSpan = document.createElement("span");
    textSpan.innerText = address || "Konum Doğrulanıyor...";

    el.appendChild(iconSpan);
    el.appendChild(textSpan);

    new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat(center)
      .addTo(map.current);

    map.current.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: "© Mapbox",
      }),
      "bottom-right"
    );

    // Temizlik
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []); // [] bırakırsan sadece 1 kere çalışır. Eğer center değişince harita kaysın istersen [center[0], center[1]] ekle.

  // 2. Sadece Status Değişince İkonu Güncelle
  useEffect(() => {
    const iconEl = markerIconRef.current;
    if (!iconEl) return;

    if (isPending) {
      iconEl.innerHTML = '<div class="loading-spinner"></div>';
    } else if (!isPending && verifyLocation) {
      iconEl.innerHTML = '<span class="text-success">✓</span>';
    } else if (!isPending && !verifyLocation) {
      iconEl.innerHTML = '<span class="text-error">✕</span>';
    }
  }, [status]); // Sadece status değişince çalışır

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "400px", borderRadius: "12px" }}
    />
  );
};

export default MapWithStatusMarker;
