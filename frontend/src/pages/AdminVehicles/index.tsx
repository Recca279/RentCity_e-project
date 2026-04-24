import AdminLayout from '@/components/layout/AdminLayout';
import { Search, Edit, Trash2, Loader2, Car } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

export default function AdminVehiclesPage() {
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get('status');

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // 1. LẤY DANH SÁCH XE
  const fetchVehicles = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/vehicles');
      setVehicles(res.data);
    } catch (error) {
      toast.error("Không thể tải danh sách xe!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusFromUrl) {
      setStatusFilter(statusFromUrl.toUpperCase());
    }
    fetchVehicles();
  }, [statusFromUrl]);

  // 2. ĐỔI TRẠNG THÁI NHANH
  const handleStatusChange = async (vehicleId: string, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:8080/api/vehicles/admin/${vehicleId}/status?status=${newStatus}`);
      toast.success(`Đã chuyển trạng thái sang ${newStatus}`);
      fetchVehicles();
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái!");
    }
  };

  // 3. XÓA XE
  const handleDelete = async (id: string) => {
    if (!window.confirm("Xác nhận xóa xe này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/vehicles/admin/${id}`);
      toast.success("Xóa xe thành công!");
      fetchVehicles();
    } catch (error) {
      toast.error("Không thể xóa xe!");
    }
  };

  // 4. LỌC DỮ LIỆU ĐỂ HIỂN THỊ
  const filteredVehicles = vehicles.filter((v: any) => {
    const matchesSearch = v.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout title="Vehicles Management">
      {/* Thanh công cụ: Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="relative flex-1 w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search brand, model, plate..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-[1.25rem] text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-[#78ad44] outline-none shadow-sm"
          />
        </div>

        <div className="flex bg-gray-100/50 p-1.5 rounded-[1.25rem] border border-gray-50 overflow-x-auto">
          {['ALL', 'AVAILABLE', 'RENTED', 'BUSY', 'MAINTENANCE'].map((s) => (
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

      {/* Bảng danh sách xe */}
      <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 gap-4">
            <Loader2 className="animate-spin text-[#78ad44]" size={48} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[5px]">Syncing Fleet...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfdfd] border-b border-gray-50">
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Vehicle Info</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Plate</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Daily Price</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Status</th>
                  <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[3px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredVehicles.map((v: any) => (
                  <tr key={v.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <img 
                          src={v.imageUrl || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                          className="w-20 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div>
                          <p className="font-black text-gray-900 text-sm italic uppercase">{v.brand} {v.model}</p>
                          <p className="font-bold text-gray-400 text-[9px] uppercase mt-1">ID: {v.id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="bg-[#f4f8f7] text-gray-600 px-4 py-1.5 text-[10px] font-black rounded-xl border border-gray-100 italic">
                        {v.plateNumber}
                      </span>
                    </td>
                    <td className="p-8 font-black text-gray-900 italic text-sm">
                      {(v.pricePerDay || 0).toLocaleString()}đ
                    </td>
                    <td className="p-8">
                      <select 
                        value={v.status}
                        onChange={(e) => handleStatusChange(v.id, e.target.value)}
                        className={`px-4 py-2 text-[10px] font-black rounded-full uppercase tracking-widest border-2 outline-none cursor-pointer transition-all ${
                          v.status === 'AVAILABLE' ? 'bg-[#e9f2eb] text-[#78ad44] border-[#78ad44]/10' : 
                          v.status === 'RENTED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          v.status === 'MAINTENANCE' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-orange-50 text-orange-500 border-orange-100'
                        }`}
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="RENTED">Rented</option>
                        <option value="BUSY">Busy</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-3.5 bg-gray-50 text-gray-400 hover:text-black hover:bg-white rounded-2xl transition-all"><Edit size={16} /></button>
                        <button 
                          onClick={() => handleDelete(v.id)}
                          className="p-3.5 bg-red-50/50 text-gray-400 hover:text-red-600 hover:bg-white rounded-2xl transition-all"
                        ><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVehicles.length === 0 && (
              <div className="p-32 text-center flex flex-col items-center gap-4">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                    <Car size={40} />
                 </div>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-[6px]">Fleet is empty</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}