import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { register as registerUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const registerFormSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
  email: z.string().min(1, { message: 'Email là bắt buộc' }).email({ message: 'Phải là email hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  confirmPassword: z.string().min(1, { message: 'Xác nhận mật khẩu là bắt buộc' }),
  phone: z.string().min(10, { message: 'Số điện thoại phải có ít nhất 10 chữ số' }),
  birthday: z.string().min(1, { message: 'Ngày sinh là bắt buộc' }),
  gender: z.enum(['true', 'false']),
  agreeToTerms: z.boolean().refine(val => val === true, { message: 'Bạn phải đồng ý với các điều khoản và điều kiện' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      birthday: '',
      gender: 'true', // Male by default
      agreeToTerms: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setRegisterError(null);
      
      // Extract necessary data and transform gender string to boolean
      const { confirmPassword, agreeToTerms, ...userData } = values;
      
      const response = await registerUser({
        ...userData,
        gender: values.gender === 'true',
      });
      
      if (response.statusCode === 200) {
        navigate('/auth/login');
      } else {
        setRegisterError(response.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setRegisterError(errorMessage);
      console.error('Đăng ký thất bại:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Tạo tài khoản</CardTitle>
        <CardDescription>
          Nhập thông tin của bạn để tạo tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        {registerError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {registerError}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập họ và tên của bạn" 
                      disabled={isLoading}
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
                      placeholder="email@example.com" 
                      type="email"
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
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
                      placeholder="Số điện thoại của bạn" 
                      type="tel"
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      className="flex space-x-4"
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="••••••••" 
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        {...field} 
                      />
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="••••••••" 
                        type={showConfirmPassword ? "text" : "password"}
                        disabled={isLoading}
                        {...field} 
                      />
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      Tôi đồng ý với <a href="#" className="text-primary hover:underline">điều khoản dịch vụ</a> và <a href="#" className="text-primary hover:underline">chính sách bảo mật</a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo tài khoản...
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          Đã có tài khoản?{' '}
          <Link to="/auth/login" className="text-primary font-medium hover:underline">
            Đăng nhập
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;