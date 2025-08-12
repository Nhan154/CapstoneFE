import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocations } from '@/services/api';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Location } from '@/types';
import { Search, Loader2 } from 'lucide-react';

const LocationCard = ({ location }: { location: Location }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/properties/location/${location.id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="relative aspect-[4/3]">
        <img 
          src={location.hinhAnh || 'https://placehold.co/600x400?text=No+Image'} 
          alt={location.tenViTri} 
          className="object-cover w-full h-full"
          onError={(e) => {
            // If image fails to load, replace with placeholder
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/600x400?text=No+Image';
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{location.tenViTri}</h3>
        <p className="text-gray-500 text-sm">{location.tinhThanh}, {location.quocGia}</p>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await getLocations();
        if (response && response.content) {
          setLocations(response.content);
        }
      } catch (error) {
        console.error('Failed to fetch locations', error);
        setError('Không thể tải danh sách địa điểm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/properties/search?keyword=${encodeURIComponent(searchTerm)}`);
  };

  const filteredLocations = locations.filter(location => 
    location.tenViTri.toLowerCase().includes(searchTerm.toLowerCase()) || 
    location.tinhThanh.toLowerCase().includes(searchTerm.toLowerCase()) || 
    location.quocGia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="py-10 md:py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Tìm nơi lưu trú tiếp theo</h1>
            <p className="text-xl text-gray-600">Tìm kiếm ưu đãi khách sạn, nhà ở và nhiều hơn nữa...</p>
            
            {/* Search form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mt-6">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  className="pl-10 pr-4 py-6 rounded-full shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                <Button 
                  type="submit" 
                  className="absolute right-2 rounded-full" 
                  size="sm"
                >
                 Tìm kiếm
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-10">
          <h2 className="text-2xl font-bold mb-6">Điểm đến phổ biến</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">Không tìm thấy bất động sản nào tại địa điểm này.</p>
                </div>
              )}
            </div>
          )}
        </section>
        
        {/* Featured Categories */}
        <section className="py-10">
          <h2 className="text-2xl font-bold mb-6">Lưu trú mọi nơi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <img 
                src="https://a0.muscache.com/pictures/7630c83f-96a8-4232-9a10-0398661e2e6f.jpg" 
                alt="Tiny homes" 
                className="rounded-lg aspect-square object-cover"
              />
              <h3 className="font-medium">Nhà nhỏ</h3>
            </div>
            <div className="space-y-2">
              <img 
                src="https://a0.muscache.com/pictures/3b1eb541-46d9-4bef-abc4-c37d77e3c21b.jpg" 
                alt="Amazing views" 
                className="rounded-lg aspect-square object-cover"
              />
              <h3 className="font-medium">Tầm nhìn tuyệt vời</h3>
            </div>
            <div className="space-y-2">
              <img 
                src="https://a0.muscache.com/pictures/c0a24c04-ce1f-490c-833f-987613930eca.jpg" 
                alt="Countryside" 
                className="rounded-lg aspect-square object-cover"
              />
              <h3 className="font-medium">Nông thôn</h3>
            </div>
            <div className="space-y-2">
              <img 
                src="https://a0.muscache.com/pictures/8e507f16-4943-4be9-b707-59bd38d56309.jpg" 
                alt="Beachfront" 
                className="rounded-lg aspect-square object-cover"
              />
              <h3 className="font-medium">Bãi biển</h3>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;