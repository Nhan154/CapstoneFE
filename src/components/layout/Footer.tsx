import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t mt-16">
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold border-b pb-4 mb-8">Nguồn cảm hứng cho những kỳ nghỉ sau này</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hỗ trợ */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="text-gray-600 hover:underline">Trung tâm trợ giúp</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">AirCover</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Chống phân biệt đối xử</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Hỗ trợ người khuyết tật</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Các tùy chọn hủy</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Báo cáo lo ngại của khu dân cư</Link></li>
            </ul>
          </div>
          
          {/* Đón tiếp khách */}
          <div>
            <h3 className="font-semibold mb-4">Đón tiếp khách</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="text-gray-600 hover:underline">Cho thuê nhà trên Airbnb</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Đưa trải nghiệm của bạn lên Airbnb</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Đưa dịch vụ của bạn lên Airbnb</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">AirCover cho host</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Tài nguyên về đón tiếp khách</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Diễn đàn cộng đồng</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Đón tiếp khách có trách nhiệm</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Tham gia khóa học miễn phí về công việc Đón tiếp khách</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Tìm host hỗ trợ</Link></li>
            </ul>
          </div>
          
          {/* Airbnb */}
          <div>
            <h3 className="font-semibold mb-4">Airbnb</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="text-gray-600 hover:underline">Bản phát hành Mùa hè 2025</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Trang tin tức</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Cơ hội nghề nghiệp</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Nhà đầu tư</Link></li>
              <li><Link to="#" className="text-gray-600 hover:underline">Chỗ ở khẩn cấp Airbnb.org</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm text-gray-600">
            <span>© {currentYear} Airbnb, Inc.</span>
            <span className="hidden md:block">·</span>
            <Link to="#" className="hover:underline">Quyền riêng tư</Link>
            <span className="hidden md:block">·</span>
            <Link to="#" className="hover:underline">Điều khoản</Link>
            <span className="hidden md:block">·</span>
            <Link to="#" className="hover:underline">Sơ đồ trang web</Link>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center mr-2">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <span className="mr-2">🌐</span>
                <span>Tiếng Việt (VN)</span>
              </button>
            </div>
            <div className="mr-2">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <span className="font-bold mr-1">₫</span>
                <span>VND</span>
              </button>
            </div>
            <Link to="#" className="text-gray-600 hover:text-gray-900">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;