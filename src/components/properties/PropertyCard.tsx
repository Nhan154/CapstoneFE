import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Room } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StarIcon } from 'lucide-react';

interface PropertyCardProps {
  property: Room;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(price);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://placehold.co/800x600?text=No+Image';
    setImageLoaded(true);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/properties/${property.id}`}>
        <div className="relative aspect-[4/3]">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0" />
          )}
          <img
            src={property.hinhAnh || 'https://placehold.co/800x600?text=No+Image'}
            alt={property.tenPhong}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
          {property.doXe && (
            <Badge className="absolute top-2 right-2 bg-white text-black">
              Đỗ xe miễn phí
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold truncate flex-1">{property.tenPhong}</h3>
            <div className="flex items-center gap-1 text-sm">
              <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">4.9</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mb-2">
            <p className="truncate">
              {property.khach} khách • {property.phongNgu} phòng ngủ • {property.giuong} giường • {property.phongTam} phòng tắm
            </p>
          </div>
          
          <div className="flex flex-wrap gap-1 my-2">
            {property.wifi && <Badge variant="outline">WiFi</Badge>}
            {property.bep && <Badge variant="outline">Bếp</Badge>}
            {property.dieuHoa && <Badge variant="outline">Điều hòa</Badge>}
            {property.hoBoi && <Badge variant="outline">Hồ bơi</Badge>}
          </div>
          
          <div className="mt-3 font-medium">
            <span>{formatPrice(property.giaTien)}</span>
            <span className="text-muted-foreground font-normal"> / đêm</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PropertyCard;