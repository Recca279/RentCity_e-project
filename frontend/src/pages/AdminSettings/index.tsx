import AdminLayout from '@/components/layout/AdminLayout';
import { Settings as SettingsIcon, Bell, Shield, Database } from 'lucide-react';

export default function AdminSettings() {
  return (
    <AdminLayout title="System Settings">
      <div className="max-w-4xl space-y-6">
        
        {/* Profile Settings */}
        <div className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
            <SettingsIcon className="text-[#78ad44]" size={20} />
            <h3 className="text-lg font-black text-gray-900">General Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Store Name</label>
              <input type="text" defaultValue="Rent City Pro" className="w-full p-3 bg-[#f4f8f7] border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#78ad44] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Admin Email</label>
              <input type="email" defaultValue="admin@rentcity.com" className="w-full p-3 bg-[#f4f8f7] border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#78ad44] outline-none" />
            </div>
          </div>
        </div>

        {/* System & Security */}
        <div className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
            <Shield className="text-[#78ad44]" size={20} />
            <h3 className="text-lg font-black text-gray-900">System & Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#f4f8f7] rounded-xl">
              <div>
                <p className="text-sm font-bold text-gray-900">Maintenance Mode</p>
                <p className="text-xs text-gray-400">Tắt hệ thống để bảo trì định kỳ</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <button className="bg-[#78ad44] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#689938] transition-all">
          Save Changes
        </button>

      </div>
    </AdminLayout>
  );
}