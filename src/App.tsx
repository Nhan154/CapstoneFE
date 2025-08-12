import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

// Pages
import HomePage from './pages/Index';
import NotFound from './pages/NotFound';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import PropertyDetail from './pages/properties/PropertyDetail';
import LocationProperties from './pages/properties/LocationProperties';
import SearchProperties from './pages/properties/SearchProperties';
import UserProfile from './pages/user/UserProfile';
import UserBookings from './pages/user/UserBookings';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />
            
            {/* Authentication */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            
            {/* Properties */}
            <Route path="/properties/:propertyId" element={<PropertyDetail />} />
            <Route path="/properties/location/:locationId" element={<LocationProperties />} />
            <Route path="/properties/search" element={<SearchProperties />} />
            
            {/* User */}
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/bookings" element={<UserBookings />} />
            
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;