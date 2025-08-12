import Layout from '@/components/layout/Layout';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
          <RegisterForm />
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;