import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import AdminLayout from '@/components/layout/AdminLayout';
import { Search, UserPlus, Mail, ShieldCheck, Lock, Unlock, Edit, Loader2, Phone, Shield, ShieldOff } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/users/all');
      setUsers(res.data || []);
    } catch (error) {
      toast.error("Lỗi tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const getAdminId = () => {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data).id : null;
  };

  const handleUpgradeAdmin = async (userId: string) => {
    if (!window.confirm("Thăng cấp người này làm ADMIN?")) return;
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}/upgrade-admin`);
      toast.success("Đã nâng cấp quyền Admin!");
      await fetchUsers(); // Gọi lại để cập nhật Icon và Badge
    } catch (e) { toast.error("Lỗi thăng cấp!"); }
  };

  const handleRevokeAdmin = async (userId: string) => {
    if (!window.confirm("Giáng chức người này xuống CUSTOMER?")) return;
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}/revoke-admin?adminId=${getAdminId()}`);
      toast.success("Đã hạ cấp quyền Admin!");
      await fetchUsers();
    } catch (e) { toast.error("Lỗi giáng chức!"); }
  };

  const handleBanUser = async (id: string) => {
    try {
      await axios.patch(`http://localhost:8080/api/users/${id}/ban?adminId=${getAdminId()}`);
      toast.success("Đã khóa!");
      fetchUsers();
    } catch (e) { toast.error("Lỗi!"); }
  };

  const handleUnbanUser = async (id: string) => {
    try {
      await axios.patch(`http://localhost:8080/api/users/${id}/unban?adminId=${getAdminId()}`);
      toast.success("Đã mở!");
      fetchUsers();
    } catch (e) { toast.error("Lỗi!"); }
  };

  const filteredUsers = users.filter((u: any) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (u.fullName || '').toLowerCase().includes(search) || (u.email || '').toLowerCase().includes(search);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout title="Users Management">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
        <div className="relative flex-1 w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-[1.25rem] text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#78ad44]"
          />
        </div>
        <div className="flex bg-gray-100/50 p-1.5 rounded-[1.25rem] gap-2">
          {['ALL', 'ADMIN', 'CUSTOMER'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-5 py-2 text-[9px] font-black rounded-xl transition-all ${roleFilter === r ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfdfd] border-b border-gray-50 uppercase text-[10px] font-black text-gray-400 tracking-[2px]">
                <th className="p-8">Identity</th>
                <th className="p-8">Role</th>
                <th className="p-8">Status</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50/30 group transition-colors">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-[#78ad44]">{u.fullName?.charAt(0)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-sm uppercase italic">{u.fullName}</p>
                          {/* BIỂU TƯỢNG KHIÊN CHECK CHO ADMIN */}
                          {u.role === 'ADMIN' && <ShieldCheck size={14} className="text-blue-500" />}
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 text-[9px] font-black rounded-full border-2 ${u.role === 'ADMIN' ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-gray-50 text-gray-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 text-[9px] font-black rounded-full border-2 ${u.status === 'ACTIVE' ? 'bg-[#e9f2eb] text-[#78ad44]' : 'bg-red-50 text-red-500'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      {u.status === 'ACTIVE' && (
                        u.role !== 'ADMIN' ? (
                          <button onClick={() => handleUpgradeAdmin(u.id)} className="p-3 bg-purple-50 text-purple-500 rounded-xl hover:bg-purple-500 hover:text-white transition-all"><Shield size={16}/></button>
                        ) : (
                          <button onClick={() => handleRevokeAdmin(u.id)} className="p-3 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all"><ShieldOff size={16}/></button>
                        )
                      )}
                      {u.status === 'ACTIVE' ? (
                        <button onClick={() => handleBanUser(u.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Lock size={16}/></button>
                      ) : (
                        <button onClick={() => handleUnbanUser(u.id)} className="p-3 bg-green-50 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"><Unlock size={16}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}