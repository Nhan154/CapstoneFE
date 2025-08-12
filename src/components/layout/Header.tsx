import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Search, UserCircle, LogOut, User as UserIcon } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512" 
            className="h-8 w-8 mr-2 text-rose-500 fill-rose-500" 
            aria-hidden="true"
          >
            <path d="M224 373.12c-25.24-31.67-40.08-59.43-45-83.18-22.55-88 112.61-88 90.06 0-5.45 24.25-20.29 52-45.06 83.18zm138.15 73.23c-42.06 18.31-83.67-10.88-119.3-50.47 103.9-130.07 46.11-200-18.85-200-54.92 0-85.16 46.51-73.28 100.5 6.93 29.19 25.23 62.39 54.43 99.5-32.53 36.05-60.55 52.69-85.15 54.92-50 7.43-89.11-41.06-71.3-91.09 15.1-39.16 111.72-231.18 115.87-241.56 15.75-30.07 25.56-57.4 59.38-57.4 32.34 0 43.4 25.94 60.37 59.87 36 70.62 89.35 177.48 114.84 239.09 13.17 33.07-1.37 71.29-37.01 86.64zm47-136.12C280.27 35.93 273.13 32 224 32c-45.52 0-64.87 31.67-84.66 72.79C33.18 317.1 22.89 347.19 22 349.81-3.22 419.14 48.74 480 111.63 480c21.71 0 60.61-6.06 112.37-62.4 58.68 63.78 101.26 62.4 112.37 62.4 62.89.05 114.85-60.86 89.61-130.19.02-3.89-16.82-38.9-16.82-39.58z" />
          </svg>
          <span className="text-xl font-bold text-rose-500">airbnb</span>
        </Link>

        {/* Search bar - For desktop */}
        <div className="hidden md:flex items-center border rounded-full p-1 shadow-sm hover:shadow-md transition">
          <button className="px-4 font-medium">Bất cứ đâu</button>
          <span className="border-l h-6" />
          <button className="px-4 font-medium">Tuần bất kỳ</button>
          <span className="border-l h-6" />
          <button className="pl-4 pr-2 text-gray-500">Thêm khách</button>
          <div className="bg-rose-500 p-2 rounded-full text-white">
            <Search size={16} />
          </div>
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden items-center gap-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <Link 
                  to="/"
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center gap-2 text-lg font-medium"
                >
                  Trang chủ
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/user/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      Hồ sơ
                    </Link>
                    <Link 
                      to="/user/bookings" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      Đặt chỗ của tôi
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-lg font-medium text-left text-red-500"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 text-lg font-medium"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* User menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/host" 
            className="font-medium hover:bg-gray-100 px-4 py-2 rounded-full transition"
          >
            Cho thuê nhà
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-rose-100 text-rose-500">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/user/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/user/bookings" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Đặt chỗ của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full gap-2">
                  <Menu size={16} />
                  <UserCircle size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/auth/login" className="cursor-pointer font-medium">
                    Đăng nhập
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/auth/register" className="cursor-pointer">
                    Đăng ký
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/host" className="cursor-pointer">
                    Cho thuê nhà
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/help" className="cursor-pointer">
                    Trợ giúp
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;