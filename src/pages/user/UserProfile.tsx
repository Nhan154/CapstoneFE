import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { updateUserInfo, uploadAvatar } from '@/services/api';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
  email: z.string().min(1, { message: 'Email là bắt buộc' }).email({ message: 'Phải là email hợp lệ' }),
  phone: z.string().min(10, { message: 'Số điện thoại phải có ít nhất 10 số' }),
  birthday: z.string().min(1, { message: 'Ngày sinh là bắt buộc' }),
  gender: z.enum(['true', 'false']),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const UserProfile = () => {
  const { user, isLoading: authLoading, updateUser } = useAuth();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthday: '',
      gender: 'true',
    }
  });
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
        gender: user.gender ? 'true' : 'false',
      });
    }
  }, [user, form]);
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      setUpdateError(null);
      setUpdateSuccess(false);
      
      const userData = {
        ...values,
        gender: values.gender === 'true',
      };
      
      const response = await updateUserInfo(user.id, userData);
      
      if (response.statusCode === 200) {
        setUpdateSuccess(true);
        toast.success('Hồ sơ đã được cập nhật thành công');
        
        // Update user in context
        updateUser({ ...user, ...userData });
      } else {
        setUpdateError(response.message || 'Không thể cập nhật hồ sơ');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại.';
      setUpdateError(errorMessage);
      console.error('Lỗi cập nhật hồ sơ:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn một tệp hình ảnh');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước tệp không được vượt quá 5MB');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('formFile', file);
      
      const response = await uploadAvatar(formData);
      
      if (response && response.content) {
        toast.success('Avatar đã được tải lên thành công');
        
        // Update user avatar in context
        updateUser({ ...user, avatar: response.content });
      } else {
        toast.error('Không thể tải lên avatar');
      }
    } catch (error: any) {
      console.error('Lỗi tải lên avatar:', error);
      toast.error(error?.response?.data?.message || 'Không thể tải lên avatar. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
      // Clear the input
      if (e.target) {
        e.target.value = '';
      }
    }
  };
  
  if (authLoading || !user) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const getUserInitials = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Hồ sơ của bạn</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Ảnh đại diện</CardTitle>
                  <CardDescription>
                    Cập nhật ảnh đại diện của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative group mb-4">
                    <Avatar className="h-32 w-32 cursor-pointer" onClick={handleAvatarClick}>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-3xl bg-primary/20">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    
                    {/* Overlay ôm sát avatar */}
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      ) : (
                        <Camera className="h-8 w-8 text-white" />
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </div>
                  
                  <div className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={isUploading}
                      onClick={handleAvatarClick}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang tải lên...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Thay đổi ảnh
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    JPG, PNG hoặc GIF. Tối đa 5MB.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin chi tiết cá nhân của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {updateSuccess && (
                    <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>
                        Hồ sơ của bạn đã được cập nhật thành công.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {updateError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>{updateError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nhập họ và tên của bạn" 
                                disabled={isUpdating}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="you@example.com" 
                                type="email"
                                disabled={true} // Email should not be editable
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              Email không thể thay đổi
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Số điện thoại" 
                                type="tel"
                                disabled={isUpdating}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày sinh</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="DD/MM/YYYY" 
                                type="date"
                                disabled={isUpdating}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giới tính</FormLabel>
                            <FormControl>
                              <RadioGroup
                                className="flex space-x-6"
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={isUpdating}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="true" id="male" />
                                  <label htmlFor="male" className="text-sm cursor-pointer">Nam</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="false" id="female" />
                                  <label htmlFor="female" className="text-sm cursor-pointer">Nữ</label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang cập nhật...
                          </>
                        ) : (
                          'Lưu thay đổi'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;