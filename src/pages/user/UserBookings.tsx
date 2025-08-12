import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { getBookingsByUserId, getRoomById, deleteBooking } from '@/services/api';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Booking, Room } from '@/types';
import { Loader2, Calendar, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface BookingWithRoom extends Booking {
  room?: Room;
}

const UserBookings = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || !user) {
        navigate('/auth/login');
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getBookingsByUserId(user.id);
        
        if (response.statusCode === 200) {
          // Fetch room details for each booking
          const bookingsWithRooms = await Promise.all(
            response.content.map(async (booking: Booking) => {
              try {
                const roomResponse = await getRoomById(booking.maPhong);
                if (roomResponse.statusCode === 200) {
                  return { ...booking, room: roomResponse.content };
                }
                return booking;
              } catch (error) {
                console.error(`Error fetching room ${booking.maPhong}:`, error);
                return booking;
              }
            })
          );
          
          setBookings(bookingsWithRooms);
        } else {
          setError(response.message || 'Failed to load bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user, isAuthenticated, navigate]);
  
  const handleCancelBooking = async (bookingId: number) => {
    try {
      setCancellingBookingId(bookingId);
      
      const response = await deleteBooking(bookingId);
      
      if (response.statusCode === 200) {
        toast.success('Booking cancelled successfully');
        // Remove the cancelled booking from the list
        setBookings(bookings.filter(booking => booking.id !== bookingId));
      } else {
        toast.error(response.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingBookingId(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="mb-6">Please login to view your bookings</p>
          <Button onClick={() => navigate('/auth/login')}>Login</Button>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-medium mb-4">You have no bookings</h2>
              <p className="text-muted-foreground mb-6">Start exploring and book your next stay</p>
              <Button onClick={() => navigate('/')}>Browse Properties</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      {booking.room && (
                        <Link to={`/properties/${booking.maPhong}`}>
                          <div className="relative h-48 md:h-full">
                            <img
                              src={booking.room.hinhAnh || 'https://placehold.co/600x400?text=No+Image'}
                              alt={booking.room.tenPhong}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'https://placehold.co/600x400?text=No+Image';
                              }}
                            />
                          </div>
                        </Link>
                      )}
                    </div>
                    
                    <div className="p-6 md:w-2/3">
                      <CardHeader className="px-0 pt-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>
                              {booking.room ? (
                                <Link to={`/properties/${booking.maPhong}`} className="hover:underline">
                                  {booking.room.tenPhong}
                                </Link>
                              ) : (
                                `Room #${booking.maPhong}`
                              )}
                            </CardTitle>
                            {booking.room && (
                              <CardDescription>
                                {booking.room.phongNgu} bedroom{booking.room.phongNgu > 1 ? 's' : ''} • {booking.room.giuong} bed{booking.room.giuong > 1 ? 's' : ''} • {booking.room.phongTam} bath{booking.room.phongTam > 1 ? 's' : ''}
                              </CardDescription>
                            )}
                          </div>
                          
                          <Badge variant="outline">
                            Booking #{booking.id}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="px-0 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Check-in</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(booking.ngayDen)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Check-out</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(booking.ngayDi)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Guests</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.soLuongKhach} {booking.soLuongKhach === 1 ? 'guest' : 'guests'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="px-0 pt-2 pb-0 flex-col items-start sm:flex-row sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          {booking.room && (
                            <p className="font-semibold">
                              {new Intl.NumberFormat('vi-VN', { 
                                style: 'currency', 
                                currency: 'VND',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0 
                              }).format(booking.room.giaTien)}
                              <span className="font-normal text-muted-foreground"> / night</span>
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Link to={`/properties/${booking.maPhong}`}>
                            <Button variant="outline">View Property</Button>
                          </Link>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">
                                {cancellingBookingId === booking.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Cancel'
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will cancel your booking and cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>No, keep booking</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Yes, cancel booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserBookings;