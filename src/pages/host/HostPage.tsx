import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { createRoom, getLocations } from '@/services/api';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import { Location } from '@/types';

// Schema validate form
const roomSchema = z.object({
  tenPhong: z.string().min(5, 'Tên phòng phải có ít nhất 5 ký tự'),
  khach: z.coerce.number().min(1, 'Số khách tối thiểu là 1'),
  phongNgu: z.coerce.number().min(1, 'Số phòng ngủ tối thiểu là 1'),
  giuong: z.coerce.number().min(1, 'Số giường tối thiểu là 1'),
  phongTam: z.coerce.number().min(1, 'Số phòng tắm tối thiểu là 1'),
  giaTien: z.coerce.number().min(10000, 'Giá tiền không hợp lệ'),
  maViTri: z.string().min(1, 'Vui lòng chọn vị trí'),
  moTa: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  hinhAnh: z.string().url('Link hình ảnh không hợp lệ').optional().or(z.literal('')),
  // Tiện ích
  mayGiat: z.boolean().default(false),
  banLa: z.boolean().default(false),
  tivi: z.boolean().default(false),
  dieuHoa: z.boolean().default(false),
  wifi: z.boolean().default(false),
  bep: z.boolean().default(false),
  doXe: z.boolean().default(false),
  hoBoi: z.boolean().default(false),
});

const HostPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      tenPhong: '',
      khach: 1,
      phongNgu: 1,
      giuong: 1,
      phongTam: 1,
      giaTien: 0,
      moTa: '',
      hinhAnh: '',
      mayGiat: false,
      banLa: false,
      tivi: false,
      dieuHoa: false,
      wifi: true,
      bep: false,
      doXe: false,
      hoBoi: false,
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    const fetchLocations = async () => {
      try {
        const res = await getLocations();
        if (res.content) setLocations(res.content);
      } catch (error) {
        console.error('Failed to fetch locations', error);
      }
    };
    fetchLocations();
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: z.infer<typeof roomSchema>) => {
    try {
      setIsLoading(true);
      // Convert maViTri to number and default image if empty
      const submitData = {
        ...values,
        maViTri: parseInt(values.maViTri),
        hinhAnh: values.hinhAnh || 'https://placehold.co/600x400?text=New+Room', 
      };

      const res = await createRoom(submitData);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        toast.success('Đăng phòng thành công!');
        navigate('/user/profile'); // Hoặc điều hướng về trang chi tiết phòng vừa tạo
      } else {
        toast.error('Có lỗi xảy ra: ' + res.message);
      }
    } catch (error) {
      toast.error('Không thể đăng phòng. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-rose-500">Đăng tin cho thuê nhà</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Tên phòng & Vị trí */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tenPhong"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên phòng</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: Căn hộ cao cấp view biển" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maViTri"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vị trí</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vị trí" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc.id} value={loc.id.toString()}>
                                {loc.tenViTri}, {loc.tinhThanh}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Thông số phòng */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="khach"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Khách</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phongNgu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phòng ngủ</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="giuong"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giường</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phongTam"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phòng tắm</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Giá tiền & Hình ảnh */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="giaTien"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá tiền (VNĐ/đêm)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="hinhAnh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link hình ảnh (URL)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>Nhập link ảnh hoặc để trống để dùng ảnh mặc định</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tiện ích */}
                <div className="space-y-3">
                  <FormLabel>Tiện nghi</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['wifi', 'dieuHoa', 'bep', 'doXe', 'hoBoi', 'mayGiat', 'banLa', 'tivi'].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name={item as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {item === 'dieuHoa' ? 'Điều hòa' : 
                               item === 'doXe' ? 'Đỗ xe' : 
                               item === 'hoBoi' ? 'Hồ bơi' : 
                               item === 'mayGiat' ? 'Máy giặt' : 
                               item === 'banLa' ? 'Bàn là' : 
                               item === 'bep' ? 'Bếp' : item}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="moTa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả chi tiết</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Mô tả về không gian, vị trí, tiện nghi..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Đăng phòng ngay
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HostPage;