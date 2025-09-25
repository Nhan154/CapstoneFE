import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { getRoomById, createBooking } from '@/services/api';
import Layout from '@/components/layout/Layout';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, User, Wifi, Coffee, Car, Tv, Loader2, Ban } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import GoogleMapComponent from '@/components/map/GoogleMapComponent';
import { RoomRating } from '@/components/rating/RoomRating';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const PropertyDetail = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [property, setProperty] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Booking state
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  // Calculate number of nights
  const nights = checkIn && checkOut
    ? Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!propertyId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const id = parseInt(propertyId);
        if (isNaN(id)) {
          throw new Error('Invalid property ID');
        }
        
        const response = await getRoomById(id);
        
        if (response.statusCode === 200) {
          setProperty(response.content);
        } else {
          setError(response.message || 'Failed to load property details');
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
        setError('Failed to load property details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [propertyId]);
  
  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    if (isNaN(value) || value < 1) {
      setGuests(1);
    } else if (property && value > property.khach) {
      setGuests(property.khach);
    } else {
      setGuests(value);
    }
  };
  
  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    
    if (!propertyId || !checkIn || !checkOut || guests < 1) {
      toast.error('Please select check-in, check-out dates and number of guests');
      return;
    }
    
    if (nights <= 0) {
      toast.error('Check-out date must be after check-in date');
      return;
    }
    
    try {
      setIsBooking(true);
      setBookingError(null);
      
      const bookingData = {
        maPhong: parseInt(propertyId),
        ngayDen: checkIn.toISOString(),
        ngayDi: checkOut.toISOString(),
        soLuongKhach: guests,
        maNguoiDung: user?.id || 0
      };
      
      const response = await createBooking(bookingData);
      
      if (response.statusCode === 200 || response.statusCode === 201) {
        setBookingSuccess(true);
        toast.success('Booking successful!');
        
        // Reset booking form
        setCheckIn(undefined);
        setCheckOut(undefined);
        setGuests(1);
      } else {
        setBookingError(response.message || 'Failed to create booking');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Failed to create booking. Please try again.';
      setBookingError(errorMessage);
      console.error('Booking failed:', error);
    } finally {
      setIsBooking(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  if (error || !property) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <Alert variant="destructive" className="max-w-3xl mx-auto">
            <AlertDescription>
              {error || 'Property not found'}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-8">
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {/* Property Header */}
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{property.tenPhong}</h1>
          
          <div className="flex flex-wrap gap-2 items-center mb-6">
            <Badge variant="secondary" className="text-sm">
              {property.phongNgu} phòng ngủ
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {property.giuong} giường
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {property.phongTam} phòng tắm
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Tối đa {property.khach} khách
            </Badge>
          </div>
          
          {/* Property Images */}
          <div className="relative rounded-xl overflow-hidden mb-8">
            <img 
              src={property.hinhAnh || 'https://placehold.co/1200x800?text=No+Image+Available'} 
              alt={property.tenPhong}
              className="w-full h-[500px] object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/1200x800?text=No+Image+Available';
              }}
            />
          </div>
          
          {/* Property Details and Booking */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Details Column */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Về nơi này</h2>
              <p className="text-gray-700 mb-6">
                {property.moTa || 'Chỗ ở tuyệt đẹp với đầy đủ tiện nghi cần thiết cho một kỳ nghỉ thoải mái.'}
              </p>
              
              <Separator className="my-6" />
              
              <h3 className="text-xl font-semibold mb-4">Nơi này cung cấp</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {property.mayGiat && (
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-gray-600" />
                    <span>Máy giặt</span>
                  </div>
                )}
                {property.banLa && (
                  <div className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-gray-600" />
                    <span>Bàn là</span>
                  </div>
                )}
                {property.tivi && (
                  <div className="flex items-center gap-2">
                    <Tv className="h-5 w-5 text-gray-600" />
                    <span>TV</span>
                  </div>
                )}
                {property.dieuHoa && (
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-gray-600" />
                    <span>Điều hòa</span>
                  </div>
                )}
                {property.wifi && (
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-gray-600" />
                    <span>WiFi miễn phí</span>
                  </div>
                )}
                {property.bep && (
                  <div className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-gray-600" />
                    <span>Bếp</span>
                  </div>
                )}
                {property.doXe && (
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-gray-600" />
                    <span>Đỗ xe miễn phí</span>
                  </div>
                )}
                {property.hoBoi && (
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-gray-600" />
                    <span>Hồ bơi</span>
                  </div>
                )}
                {!property.mayGiat && !property.banLa && !property.tivi && 
                  !property.dieuHoa && !property.wifi && !property.bep && 
                  !property.doXe && !property.hoBoi && (
                  <div className="flex items-center gap-2">
                    <Ban className="h-5 w-5 text-gray-600" />
                    <span>Không có tiện nghi được chỉ định</span>
                  </div>
                )}
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-xl font-semibold mb-4">Vị trí</h3>
              <p className="text-gray-700 mb-4">
                {property.moTaVitri || 'Vị trí tuyệt vời với khả năng tiếp cận dễ dàng đến các điểm thu hút địa phương.'}
              </p>
              
              {/* Map Component */}
              <div className="mt-4 mb-8">
                <GoogleMapComponent
                  center={{ lat: 10.8231, lng: 106.6297 }} // Default to Ho Chi Minh City
                  markers={[{
                    position: { lat: 10.8231, lng: 106.6297 },
                    title: property.tenPhong
                  }]}
                  zoom={15}
                  height="300px"
                />
              </div>

              <Separator className="my-6" />

              {/* Rating Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Đánh giá từ khách hàng</h3>
                <RoomRating roomId={property.id} />
              </div>
            </div>
            
            {/* Booking Column */}
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-2xl font-semibold">
                        {new Intl.NumberFormat('vi-VN', { 
                          style: 'currency', 
                          currency: 'VND',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0 
                        }).format(property.giaTien)}
                      </p>
                      <p className="text-muted-foreground">mỗi đêm</p>
                    </div>
                    <Badge className="text-xs">
                      Tối đa {property.khach} khách
                    </Badge>
                  </div>
                  
                  {bookingSuccess && (
                    <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>
                        Your booking was successful! Check your bookings in your profile.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {bookingError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>{bookingError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    {/* Check-in date */}
                    <div>
                      <p className="text-sm font-medium mb-1">Nhận phòng</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkIn ? format(checkIn, "PPP") : <span>Chọn ngày</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Check-out date */}
                    <div>
                      <p className="text-sm font-medium mb-1">Trả phòng</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOut ? format(checkOut, "PPP") : <span>Chọn ngày</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            initialFocus
                            disabled={(date) => !checkIn || date <= checkIn || date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Guests */}
                    <div>
                      <p className="text-sm font-medium mb-1">Khách</p>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min={1}
                          max={property.khach}
                          value={guests}
                          onChange={handleGuestsChange}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tối đa {property.khach} khách
                      </p>
                    </div>
                    
                    {/* Price calculation */}
                    {nights > 0 && (
                      <div className="mt-4">
                        <Separator className="my-4" />
                        <div className="flex justify-between mb-2">
                          <span>
                            {new Intl.NumberFormat('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0 
                            }).format(property.giaTien)} x {nights} đêm
                          </span>
                          <span>
                            {new Intl.NumberFormat('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0 
                            }).format(property.giaTien * nights)}
                          </span>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between font-bold">
                          <span>Tổng cộng</span>
                          <span>
                            {new Intl.NumberFormat('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0 
                            }).format(property.giaTien * nights)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full mt-4" 
                      disabled={!checkIn || !checkOut || isBooking}
                      onClick={handleBooking}
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang đặt...
                        </>
                      ) : (
                        'Đặt ngay'
                      )}
                    </Button>
                    
                    {!isAuthenticated && (
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Bạn cần đăng nhập trước khi đặt phòng
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;