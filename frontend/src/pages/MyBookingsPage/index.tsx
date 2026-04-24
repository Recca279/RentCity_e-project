import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../LandingPage/Header';
import Footer from '../LandingPage/Footer';
import CustomerSidebar from '@/components/layout/CustomerSidebar';
import { Calendar, MapPin, ChevronRight, Loader2, CreditCard, Car, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) { setLoading(false); return; }
      const user = JSON.parse(savedUser);
      const response = await axios.get(`http://localhost:8080/api/bookings/user/${user.id}`);
      
      const sortedData = response.data.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.created_at || a.id).getTime();
        const dateB = new Date(b.createdAt || b.created_at || b.id).getTime();
        return dateB - dateA;
      });
      setBookings(sortedData);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Cậu có chắc muốn hủy đơn hàng này không?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/bookings/${bookingId}`);
      toast.success("Đã xóa đơn hàng!");
      fetchBookings();
    } catch (error) {
      toast.error("Lỗi xóa đơn!");
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-10">
        <CustomerSidebar />
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 min-h-[600px]">
            <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">My Bookings</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Manage your luxury rentals</p>
              </div>
              <div className="bg-[#78ad44]/10 text-[#78ad44] px-6 py-2 rounded-2xl text-xs font-black uppercase border border-[#78ad44]/20 shadow-sm">
                {bookings.length} Orders
              </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="animate-spin text-[#78ad44]" size={48} />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Accessing Database...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {bookings.length > 0 ? (
                  bookings.map((booking: any) => (
                    <div key={booking.id} className="group border border-gray-50 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-8 hover:shadow-2xl hover:shadow-[#78ad44]/10 transition-all bg-white relative overflow-hidden">
                      {/* FIX LỖI ẢNH TẠI ĐÂY */}
                      <div className="w-full md:w-72 h-44 shrink-0 rounded-[2rem] overflow-hidden relative shadow-md bg-gray-100">
                        <img 
                          src={booking.vehicle?.imageUrl || booking.vehicle?.image_url || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                          alt="Vehicle" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${
                          booking.status === 'PENDING' ? 'bg-orange-500 text-white' : 'bg-[#78ad44] text-white'
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter group-hover:text-[#78ad44] transition-colors">
                                {booking.vehicle?.brand} {booking.vehicle?.model || 'Exclusive Fleet'}
                              </h3>
                              <p className="text-[10px] font-black text-[#78ad44] uppercase tracking-[2px] mt-1">
                                Transaction ID: #{booking.id?.substring(0,8)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-black text-gray-900">
                                {(booking.totalAmount || booking.total_amount || 0).toLocaleString()}đ
                              </span>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Grand Total</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-[#f8f9fa] p-4 rounded-2xl border border-gray-50">
                              <Calendar size={18} className="text-[#78ad44]" /> 
                              <span className="text-xs font-bold text-gray-700 uppercase">
                                {new Date(booking.startDateTime || booking.start_date_time || Date.now()).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 bg-[#f8f9fa] p-4 rounded-2xl border border-gray-50">
                              <MapPin size={18} className="text-[#78ad44]" /> 
                              <span className="text-xs font-bold text-gray-700 uppercase">
                                {booking.vehicle?.location || 'Hanoi Premium Hub'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-8 flex justify-end items-center gap-4 border-t border-gray-50 pt-6">
                          <button onClick={() => handleCancelBooking(booking.id)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 px-4 py-2 transition-all">
                            <Trash2 size={14} /> Cancel Booking
                          </button>
                          {booking.status === 'PENDING' && (
                            <button onClick={() => navigate(`/payment?amount=${booking.totalAmount || booking.total_amount}&bookingId=${booking.id}`)} className="bg-[#78ad44] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#78ad44]/30 hover:bg-black transition-all">
                              <CreditCard size={14} className="inline mr-2" /> Pay Now
                            </button>
                          )}
                          <button onClick={() => navigate(`/my-bookings/${booking.id}`)} className="bg-white border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-black transition-all">
                            Trip Details <ChevronRight size={14} className="inline ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 opacity-40">
                    <Car size={64} className="text-gray-200 mb-6" />
                    <p className="text-gray-400 font-black uppercase text-sm italic tracking-[4px]">No adventures yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}