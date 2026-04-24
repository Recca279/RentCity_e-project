import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, Download, Ticket, Loader2, ShieldCheck, User, Calendar, MapPin, Hash } from 'lucide-react';
import { toast } from 'sonner';

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/bookings/${id}`);
        setBooking(res.data);
      } catch (e) { 
        console.error(e);
        toast.error("Không tìm thấy đơn hàng!");
      } finally { 
        setLoading(false); 
      }
    };
    if (id) fetchBookingDetail();
  }, [id]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/${id}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_RentCity_${id?.substring(0,8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success("Hóa đơn đã được tải xuống!");
    } catch (e) {
      toast.error("Lỗi xuất file PDF!");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#fcfdfd]">
      <Loader2 className="animate-spin text-[#78ad44]" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[5px] text-gray-400">Loading details...</p>
    </div>
  );

  if (!booking) return (
    <div className="pt-40 text-center flex flex-col items-center gap-4">
      <h2 className="text-4xl font-black italic uppercase">404 NOT FOUND</h2>
      <button onClick={() => navigate(-1)} className="bg-black text-white px-8 py-3 rounded-xl font-black uppercase text-xs">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfd] flex flex-col font-sans p-4 md:p-10">
      <div className="max-w-4xl mx-auto w-full pt-10">
        
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }} 
          className="group flex items-center gap-2 text-xs font-black text-gray-400 mb-8 hover:text-[#78ad44] transition-all uppercase tracking-[2px]"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Previous Page
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/40 overflow-hidden border border-gray-50">
          <div className="bg-[#1a1c1e] p-10 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#78ad44]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-1.5 text-[9px] font-black rounded-full text-white uppercase tracking-widest shadow-lg ${
                    booking.status === 'PENDING' ? 'bg-orange-500' : 
                    booking.status === 'CONFIRMED' || booking.status === 'RENTED' ? 'bg-[#78ad44]' : 'bg-gray-500'
                  }`}>
                    {booking.status}
                  </span>
                  <div className="flex items-center gap-1 text-white/30 text-[9px] font-black uppercase tracking-widest">
                    <Hash size={10} /> {booking.id?.substring(0,12)}
                  </div>
                </div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                  {booking.vehicle?.brand} {booking.vehicle?.model}
                </h1>
              </div>
              <button 
                type="button"
                onClick={handleDownload} 
                className="bg-[#78ad44] hover:bg-white hover:text-[#78ad44] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 shrink-0 active:scale-95"
              >
                <Download size={18}/> Download Invoice
              </button>
            </div>
          </div>

          <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 space-y-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                  <User size={14} className="text-[#78ad44]" /> Customer Info
                </h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center border-b border-gray-200/30 pb-3">
                     <span className="text-gray-400 uppercase text-[9px] font-black">Full Name</span>
                     <span className="text-gray-900 uppercase italic font-black text-sm">
                       {booking.customer?.fullName || booking.customerPhone || "Guest User"}
                     </span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-gray-400 uppercase text-[9px] font-black">Pickup Hub</span>
                     <span className="text-gray-900 font-bold text-sm flex items-center gap-1">
                       <MapPin size={12} className="text-[#78ad44]"/> {booking.vehicle?.location || "Hanoi Hub"}
                     </span>
                   </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                  <Calendar size={14} className="text-[#78ad44]" /> Schedule
                </h4>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[8px] font-black text-gray-400 uppercase">Pickup</p>
                    <p className="font-black text-gray-900 text-[11px] mt-1">{new Date(booking.startDateTime).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="flex-1 p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[8px] font-black text-gray-400 uppercase">Return</p>
                    <p className="font-black text-gray-900 text-[11px] mt-1">{new Date(booking.endDateTime).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                   <h4 className="text-[10px] font-black text-[#78ad44] uppercase tracking-[2px] mb-2 flex items-center gap-2">
                     <Ticket size={14} /> Total Paid
                   </h4>
                   <div className="text-4xl font-black text-gray-900 tracking-tighter italic">
                     {(booking.totalAmount || 0).toLocaleString()}<span className="text-lg ml-1 font-bold">₫</span>
                   </div>
                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                     <ShieldCheck size={12} className="text-[#78ad44]" /> Secured Transaction
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}