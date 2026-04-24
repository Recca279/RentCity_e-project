import AdminLayout from '@/components/layout/AdminLayout';
import { 
  Search, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  Calendar, 
  Phone, 
  Car, 
  DollarSign, 
  Eye, 
  ListOrdered 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function AdminBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/bookings/admin/all');
      setBookings(res.data || []);
    } catch (error) {
      toast.error("Không thể kết nối Backend!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirm = async (id: string) => {
    if (!window.confirm("Xác nhận duyệt đơn và giao xe (RENTED)?")) return;
    try {
      await axios.patch(`http://localhost:8080/api/bookings/${id}/status?status=CONFIRMED`);
      toast.success("Đã duyệt đơn và giao xe thành công!");
      fetchBookings();
    } catch (error) {
      toast.error("Lỗi xử lý duyệt đơn!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Cậu có chắc muốn xóa đơn này khỏi hệ thống?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/bookings/admin/${id}`);
      toast.success("Đã xóa đơn hàng!");
      fetchBookings();
    } catch (error) {
      toast.error("Lỗi khi xóa đơn!");
    }
  };

  const filteredBookings = bookings.filter((b: any) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      b.customerPhone?.includes(search) || 
      b.vehicle?.brand?.toLowerCase().includes(search) ||
      b.vehicle?.model?.toLowerCase().includes(search) ||
      b.id?.toLowerCase().includes(search);
    
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout title="Bookings Management">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
        <div className="relative flex-1 w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, Phone, Car..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-[1.25rem] text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-[#78ad44] outline-none shadow-sm"
          />
        </div>

        <div className="flex bg-gray-100/50 p-1.5 rounded-[1.25rem] border border-gray-50 overflow-x-auto max-w-full">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button 
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${statusFilter === s ? 'bg-white text-gray-900 shadow-md border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 gap-4">
            <Loader2 className="animate-spin text-[#78ad44]" size={48} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[5px]">Updating Registry...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfdfd] border-b border-gray-50">
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Booking ID</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Customer & Vehicle</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Period</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Total</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Status</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-8">
                      <span className="font-black text-gray-900 text-xs italic">#{b.id.substring(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-900 font-black text-sm italic">
                          <Phone size={14} className="text-[#78ad44]" /> {b.customerPhone}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                          <Car size={14} /> {b.vehicle?.brand} {b.vehicle?.model}
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                       <div className="flex items-center gap-2 text-[10px] font-black text-gray-600">
                          <Calendar size={12} className="text-[#78ad44]" /> 
                          {new Date(b.startDateTime).toLocaleDateString('vi-VN')}
                       </div>
                    </td>
                    <td className="p-8 font-black text-gray-900 italic text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-[#78ad44]" />
                        {(b.totalAmount || 0).toLocaleString()}đ
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest border-2 ${
                        b.status === 'CONFIRMED' || b.status === 'RENTED' ? 'bg-[#e9f2eb] text-[#78ad44] border-[#78ad44]/10' : 
                        b.status === 'PENDING' ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                        'bg-gray-50 text-gray-400 border-gray-100'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        {b.status === 'PENDING' && (
                          <button 
                            onClick={() => handleConfirm(b.id)}
                            className="p-3 bg-green-50 text-green-600 hover:bg-[#78ad44] hover:text-white rounded-xl transition-all"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/admin/bookings/${b.id}`)}
                          className="p-3 bg-gray-50 text-gray-400 hover:text-black rounded-xl transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(b.id)}
                          className="p-3 bg-red-50 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && !loading && (
              <div className="p-32 text-center flex flex-col items-center gap-4 opacity-30">
                 <ListOrdered className="w-12 h-12" />
                 <p className="text-[10px] font-black uppercase tracking-[5px]">Zero Bookings Found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}