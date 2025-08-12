import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { MapPin, Loader2 } from 'lucide-react';

interface GoogleMapComponentProps {
  center: { lat: number; lng: number };
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
  }>;
  zoom?: number;
  height?: string;
  className?: string;
}

const GoogleMapComponent = ({
  center,
  markers = [{ position: center }],
  zoom = 14,
  height = '400px',
  className = ''
}: GoogleMapComponentProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyB7B7RHQF_SZGLlMTLSzNPeHsbQ1zIUSSY',
  });

  const mapContainerStyle = {
    width: '100%',
    height: height,
    borderRadius: '0.5rem'
  };

  if (loadError) {
    return (
      <div 
        style={mapContainerStyle} 
        className={`flex items-center justify-center bg-gray-100 text-center p-4 ${className}`}
      >
        <div>
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Không thể tải bản đồ</p>
          <p className="text-xs text-gray-500">Vui lòng kiểm tra kết nối mạng</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div 
        style={mapContainerStyle} 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
      >
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-gray-600">Đang tải bản đồ...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      mapContainerClassName={className}
      center={center}
      zoom={zoom}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          title={marker.title}
        />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;