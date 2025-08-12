import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email là bắt buộc' })
    .email({ message: 'Phải là email hợp lệ' }),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const LoginForm = () => {
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setFormError(null);
      await login(values.email, values.password);
      navigate('/');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message || apiError?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setFormError(errorMessage);
      console.error('Đăng nhập thất bại:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu để truy cập tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(formError || error) && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {formError || error}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      autoComplete="email"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="••••••••" 
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        disabled={isLoading}
                        {...field} 
                      />
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          Chưa có tài khoản?{' '}
          <Link to="/auth/register" className="text-primary font-medium hover:underline">
            Đăng ký
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;