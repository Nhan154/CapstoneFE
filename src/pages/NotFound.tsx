import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-bold mb-4">Không tìm thấy trang</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Button asChild>
          <Link to="/">Về trang chủ</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;