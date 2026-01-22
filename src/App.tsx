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
import HostPage from './pages/host/HostPage';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import RoomManagement from './pages/admin/RoomManagement';

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

            {/* Host */}
            <Route path="/host" element={<HostPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="rooms" element={<RoomManagement/>} />
              <Route path="locations" element={<div className="p-4">Trang quản lý vị trí (Đang phát triển)</div>} />
            </Route>
            
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;