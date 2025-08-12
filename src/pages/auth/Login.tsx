import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;
  
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Chào mừng trở lại</h1>
          
          {registrationSuccess && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <AlertDescription>
                Đăng ký thành công! Bạn có thể đăng nhập bằng thông tin đăng nhập của mình.
              </AlertDescription>
            </Alert>
          )}
          
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;