import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/components/layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Users, 
  Car, 
  ListOrdered, 
  DollarSign, 
  Calendar, 
  Loader2, 
  CheckCircle2, 
  Trash2, 
  ArrowUpRight 
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    revenue: 0, 
    activeRentals: 0, 
    totalBookings: 0 
  });

  const fetchDashboardData = async () => {
    try {
      // 1. GỌI CẢ 3 API ĐỂ CÓ ĐỦ DỮ LIỆU ĐẾM
      const [resBookings, resUsers, resVehicles] = await Promise.all([
        axios.get('http://localhost:8080/api/bookings/admin/all'),
        axios.get('http://localhost:8080/api/users/all'),
        axios.get('http://localhost:8080/api/vehicles')
      ]);

      const bData = resBookings.data || [];
      const vData = resVehicles.data || [];

      // 2. KHAI BÁO BIẾN ĐẾM XE ĐANG THUÊ (RENTED)
      const rentedCount = vData.filter((v: any) => v.status === 'RENTED').length;

      // 3. CẬP NHẬT STATE
      setBookings(bData);
      setTotalUsers(resUsers.data?.length || 0);
      setStats({
        revenue: bData.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0),
        activeRentals: rentedCount,
        totalBookings: bData.length
      });
    } catch (err) {
      console.error("Lỗi Dashboard:", err);
      toast.error("Lỗi đồng bộ dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAction = async (id: string, action: 'CONFIRM' | 'DELETE') => {
    if (!window.confirm(action === 'CONFIRM' ? "Duyệt đơn này?" : "Xóa vĩnh viễn đơn này?")) return;
    try {
      if (action === 'CONFIRM') {
        await axios.patch(`http://localhost:8080/api/bookings/${id}/status?status=CONFIRMED`);
        toast.success("Đã duyệt đơn và chuyển xe sang RENTED!");
      } else {
        await axios.delete(`http://localhost:8080/api/bookings/admin/${id}`);
        toast.success("Đã xóa đơn hàng!");
      }
      fetchDashboardData();
    } catch (error) {
      toast.error("Thao tác thất bại!");
    }
  };

  const STATS_CARDS = [
    { label: 'Total Revenue', value: `${stats.revenue.toLocaleString()} đ`, icon: DollarSign, path: '/admin/bookings', color: 'text-green-600' },
    { label: 'Active Rentals', value: stats.activeRentals.toString(), icon: Car, path: '/admin/vehicles?status=RENTED', color: 'text-blue-600' },
    { label: 'Total Bookings', value: stats.totalBookings.toString(), icon: ListOrdered, path: '/admin/bookings', color: 'text-orange-600' },
    { label: 'Registered Users', value: totalUsers.toLocaleString(), icon: Users, path: '/admin/users', color: 'text-purple-600' },
  ];

  if (loading) return (
    <AdminLayout title="Dashboard">
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 opacity-50">
        <Loader2 className="animate-spin text-[#78ad44]" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[4px]">Syncing Analytics...</p>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Dashboard Overview">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STATS_CARDS.map(stat => (
          <button 
            key={stat.label} 
            onClick={() => navigate(stat.path)}
            className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-[#f4f8f7] rounded-2xl ${stat.color} group-hover:bg-[#78ad44] group-hover:text-white transition-colors`}>
                <stat.icon size={22} />
              </div>
              <ArrowUpRight size={16} className="text-gray-300 group-hover:text-[#78ad44] transition-colors" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 mb-1 italic">{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">{stat.label}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ doanh thu giả lập */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
           <h3 className="text-lg font-black text-gray-900 uppercase italic mb-8 border-b border-gray-50 pb-4">Revenue Analytics</h3>
           <div className="h-64 flex items-end justify-between gap-3 relative">
             {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
               <div key={i} className="w-full bg-[#f4f8f7] rounded-t-2xl group relative h-full flex items-end">
                 <div style={{ height: `${h}%` }} className="w-full bg-[#78ad44] rounded-t-2xl group-hover:bg-black transition-all duration-500"></div>
                 <span className="absolute -bottom-7 text-[9px] font-black text-gray-400 uppercase">Day {i+1}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Danh sách đơn hàng mới nhất */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-5">
            <h3 className="text-lg font-black text-gray-900 uppercase italic">Latest Bookings</h3>
            <button onClick={() => navigate('/admin/bookings')} className="text-[10px] font-black text-[#78ad44] hover:text-black uppercase">View All</button>
          </div>
          <div className="space-y-6">
            {bookings.slice(0, 5).map((b: any) => (
              <div key={b.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f4f8f7] flex items-center justify-center text-[#78ad44] group-hover:bg-[#78ad44] group-hover:text-white transition-all">
                    <Calendar size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-gray-900 truncate w-32">{b.customerPhone || 'Guest'}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase truncate w-24">{b.vehicle?.brand} {b.vehicle?.model}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-black text-gray-900 italic">{(b.totalAmount || 0).toLocaleString()}đ</p>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    {b.status === 'PENDING' && (
                      <button onClick={() => handleAction(b.id, 'CONFIRM')} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white">
                        <CheckCircle2 size={12} />
                      </button>
                    )}
                    <button onClick={() => handleAction(b.id, 'DELETE')} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <p className={`text-[9px] font-black uppercase group-hover:hidden ${b.status === 'CONFIRMED' ? 'text-[#78ad44]' : 'text-orange-500'}`}>
                    {b.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}