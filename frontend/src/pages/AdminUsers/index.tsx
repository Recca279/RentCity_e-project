import AdminLayout from '@/components/layout/AdminLayout';
import { Check, Clock, Search, ShieldCheck, UserCheck, Users, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const KYC_REQUESTS = [
  { id: 'KYC-1024', customer: 'Emily Carter', email: 'emily.carter@example.com', document: 'CCCD', submittedAt: 'May 12, 2026', status: 'Pending Review' },
  { id: 'KYC-1025', customer: 'Michael Brown', email: 'michael.brown@example.com', document: 'Driving License', submittedAt: 'May 11, 2026', status: 'Pending Review' },
  { id: 'KYC-1026', customer: 'Sophia Wilson', email: 'sophia.wilson@example.com', document: 'CCCD', submittedAt: 'May 10, 2026', status: 'Needs Update' },
];

const USERS_LIST = [
  { id: 'USR-001', name: 'John Doe', email: 'john.doe@example.com', role: 'Customer', status: 'Active', joinedAt: 'Jan 12, 2026' },
  { id: 'USR-002', name: 'Sarah Manager', email: 'sarah.manager@example.com', role: 'Staff', status: 'Active', joinedAt: 'Feb 03, 2026' },
  { id: 'USR-003', name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'Active', joinedAt: 'Mar 18, 2026' },
  { id: 'USR-004', name: 'David Lee', email: 'david.lee@example.com', role: 'Customer', status: 'Pending Verify', joinedAt: 'Apr 25, 2026' },
];

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'kyc' ? 'kyc' : 'users';

  return (
    <AdminLayout title={activeTab === 'kyc' ? 'KYC Approval' : 'User Management'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex bg-[#e9f2eb] p-1 rounded-xl">
          <button
            onClick={() => setSearchParams({ tab: 'users' })}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'users' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users size={15} /> Users
          </button>
          <button
            onClick={() => setSearchParams({ tab: 'kyc' })}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'kyc' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShieldCheck size={15} /> KYC
          </button>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#78ad44]" size={18} />
          <input
            type="text"
            placeholder={activeTab === 'kyc' ? 'Search KYC requests...' : 'Search users...'}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#78ad44]/20 focus:border-[#78ad44] transition-all"
          />
        </div>
      </div>

      {activeTab === 'kyc' ? (
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-gray-900">Pending KYC Reviews</h2>
              <p className="text-sm font-bold text-gray-400 mt-1">{KYC_REQUESTS.length} requests awaiting admin action</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#e9f2eb] text-[#78ad44] flex items-center justify-center">
              <UserCheck size={22} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f8f7] border-b border-gray-100">
                  <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Request</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Document</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Submitted</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {KYC_REQUESTS.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5 font-black text-gray-900 text-sm">{request.id}</td>
                    <td className="p-5">
                      <p className="font-black text-gray-900 text-sm">{request.customer}</p>
                      <p className="font-bold text-gray-400 text-xs">{request.email}</p>
                    </td>
                    <td className="p-5 font-bold text-gray-600 text-sm">{request.document}</td>
                    <td className="p-5 font-bold text-gray-500 text-sm">{request.submittedAt}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg ${
                        request.status === 'Pending Review' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <Clock size={13} /> {request.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-white bg-[#78ad44] hover:bg-[#689938] rounded-lg transition-colors shadow-sm" title="Approve KYC">
                          <Check size={16} />
                        </button>
                        <button className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm" title="Reject KYC">
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f8f7] border-b border-gray-100">
                  <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">User</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {USERS_LIST.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5">
                      <p className="font-black text-gray-900 text-sm">{user.name}</p>
                      <p className="font-bold text-gray-400 text-xs">{user.email}</p>
                    </td>
                    <td className="p-5">
                      <span className="bg-[#f8f9fa] text-gray-600 px-3 py-1 text-xs font-bold rounded-lg border border-gray-200">{user.role}</span>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                        user.status === 'Active' ? 'bg-[#e9f2eb] text-[#78ad44]' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-5 font-bold text-gray-500 text-sm">{user.joinedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
