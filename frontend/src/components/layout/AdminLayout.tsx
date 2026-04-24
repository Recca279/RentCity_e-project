import { 
  LayoutDashboard, 
  Car, 
  ListOrdered, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Menu, // Thêm để làm nút đóng mở mobile
  X
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { type ReactNode, useState } from 'react';
import { ROUTES } from '@/constants/routes';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Quản lý đóng mở cho mobile

  const links = [
    { name: 'Dashboard', path: ROUTES.ADMIN || '/admin', icon: LayoutDashboard },
    { name: 'Vehicles', path: ROUTES.ADMIN_VEHICLES || '/admin/vehicles', icon: Car },
    { name: 'Bookings', path: ROUTES.ADMIN_BOOKINGS || '/admin/bookings', icon: ListOrdered },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    // Sửa 1: Thay min-h-screen bằng h-screen để kiểm soát scrollbar tốt hơn
    <div className="h-screen bg-[#f8f9fa] flex overflow-hidden font-sans">
      
      {/* Sidebar Overlay cho Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-gray-900 group">
            <div className="bg-[#212529] p-1.5 rounded-lg group-hover:bg-[#78ad44] transition-colors">
              <Car size={20} className="text-white"/>
            </div>
            Rent<span className="text-[#78ad44]">City</span>
          </Link>
          <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {links.map(link => {
            const isActive = link.path === '/admin' 
              ? location.pathname === '/admin' 
              : location.pathname.startsWith(link.path);

            return (
              <button
                key={link.name}
                onClick={() => {
                  navigate(link.path);
                  setIsSidebarOpen(false); // Đóng sidebar khi click trên mobile
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-sm ${
                  isActive 
                    ? 'bg-[#78ad44] text-white shadow-lg shadow-[#78ad44]/20' 
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <link.icon size={18} /> {link.name}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-sm">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      {/* Sửa 2: Dùng flex-1 và min-w-0 để main content luôn tự co giãn theo diện tích còn lại */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 truncate uppercase italic">{title}</h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative text-gray-400 hover:text-[#78ad44] transition-colors p-2">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-100 pl-4 md:pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-gray-900 leading-none">Admin User</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Superadmin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm shrink-0">
                <img src={`https://ui-avatars.com/api/?name=AD&background=212529&color=fff`} className="w-full h-full object-cover" alt="admin" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Area - Quan trọng nhất */}
        {/* Sửa 3: Dùng overflow-y-auto để nội dung cuộn độc lập, không kéo cả trang */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 bg-[#fcfdfd]">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}