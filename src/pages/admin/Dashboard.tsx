import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BedDouble, CalendarCheck, DollarSign } from 'lucide-react';
import { getDashboardStats } from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalBookings: 0,
    revenue: 0
  });

  useEffect(() => {
    // Gọi API thống kê
    getDashboardStats().then(setStats);
  }, []);

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Tổng số phòng",
      value: stats.totalRooms,
      icon: BedDouble,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Lượt đặt phòng",
      value: stats.totalBookings,
      icon: CalendarCheck,
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      title: "Doanh thu",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue),
      icon: DollarSign,
      color: "text-rose-600",
      bg: "bg-rose-100"
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +20.1% so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder cho Chart hoặc Bảng tóm tắt */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-slate-50">
            <span className="text-muted-foreground">Biểu đồ doanh thu (Cần cài thêm thư viện Recharts)</span>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Người dùng mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {/* Demo list */}
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="flex items-center">
                   <Avatar className="h-9 w-9">
                     <AvatarFallback>U{i}</AvatarFallback>
                   </Avatar>
                   <div className="ml-4 space-y-1">
                     <p className="text-sm font-medium leading-none">User {i}</p>
                     <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                   </div>
                   <div className="ml-auto font-medium text-green-600">+Active</div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;