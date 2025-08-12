import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLocationById, getRoomsByLocationId } from '@/services/api';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/properties/PropertyCard';
import { Room, Location } from '@/types';
import { Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GoogleMapComponent from '@/components/map/GoogleMapComponent';

const LocationProperties = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [properties, setProperties] = useState<Room[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Define coordinates for Vietnam locations - for demo purposes
  const locationCoordinates: Record<string, { lat: number; lng: number }> = {
    'Quận 1': { lat: 10.7756, lng: 106.7019 },
    'Quận 2': { lat: 10.7868, lng: 106.7511 },
    'Quận 3': { lat: 10.7813, lng: 106.6827 },
    'Quận 4': { lat: 10.7579, lng: 106.7014 },
    'Quận 5': { lat: 10.7544, lng: 106.6633 },
    'Quận 6': { lat: 10.7481, lng: 106.6352 },
    'Quận 7': { lat: 10.7338, lng: 106.7256 },
    'Quận 8': { lat: 10.7314, lng: 106.6351 },
    'Quận 9': { lat: 10.8428, lng: 106.8286 },
    'Quận 10': { lat: 10.7730, lng: 106.6680 },
    'Quận 11': { lat: 10.7629, lng: 106.6501 },
    'Quận 12': { lat: 10.8672, lng: 106.6413 },
    'Hồ Chí Minh': { lat: 10.8231, lng: 106.6297 },
    'Hà Nội': { lat: 21.0278, lng: 105.8342 },
    'Đà Nẵng': { lat: 16.0544, lng: 108.2022 },
    'Nha Trang': { lat: 12.2388, lng: 109.1968 },
    'Vũng Tàu': { lat: 10.3460, lng: 107.0843 },
    'Đà Lạt': { lat: 11.9404, lng: 108.4583 },
    'Phú Quốc': { lat: 10.2270, lng: 103.9680 },
    'Huế': { lat: 16.4637, lng: 107.5908 },
    'Hội An': { lat: 15.8801, lng: 108.3380 },
  };


  
  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch location details
        const locationResponse = await getLocationById(parseInt(locationId));
        if (locationResponse.statusCode === 200) {
          setLocation(locationResponse.content);
          
          // Set map coordinates based on location name
          const locationName = locationResponse.content.tenViTri;
          if (locationCoordinates[locationName]) {
            setMapCoordinates(locationCoordinates[locationName]);
          } else {
            // Default to Ho Chi Minh City if location not found
            setMapCoordinates(locationCoordinates['Hồ Chí Minh']);
          }
        }
        
        // Fetch properties in this location
        const propertiesResponse = await getRoomsByLocationId(parseInt(locationId));
        if (propertiesResponse.statusCode === 200) {
          setProperties(propertiesResponse.content);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải danh sách bất động sản. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [locationId]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      </Layout>
    );
  }
  


  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {location?.tenViTri || 'Properties'}
          </h1>
          <p className="text-muted-foreground">
            {location ? `${location.tinhThanh}, ${location.quocGia}` : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  Không tìm thấy bất động sản nào tại địa điểm này.
                </p>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 order-first lg:order-last mb-6 lg:mb-0">
            <div className="sticky top-24 bg-card border rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Vị trí trên bản đồ</span>
                </h3>
              </div>

              {mapCoordinates ? (
                <GoogleMapComponent
                  center={mapCoordinates}
                  markers={[{
                    position: mapCoordinates,
                    title: location?.tenViTri
                  }]}
                  zoom={14}
                  height="400px"
                />
              ) : (
                <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Không có thông tin vị trí</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LocationProperties;