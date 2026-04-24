import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Loader2, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function VehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/api/vehicles/${id}`, {
        headers: { 'Cache-Control': 'no-cache' } // Phá cache an toàn
      })
      .then(res => setVehicle(res.data))
      .catch(() => setVehicle(null))
      .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBooking = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Cậu nhập SĐT cho chuẩn vào nhé!");
      return;
    }

    setIsBooking(true);
    try {
      // Payload gửi đi khớp 100% với BookingRequest.java
      const payload = {
        vehicleId: id,
        customerPhone: phoneNumber
      };

      const response = await axios.post('http://localhost:8080/api/bookings', payload);

      if (response.status === 200 || response.status === 201) {
        setBookedSuccess(true);
      }
    } catch (error: any) {
      console.error("Lỗi đặt xe:", error.response?.data || error.message);
      alert("Hỏng rồi! Check lại Controller hoặc Service ở Backend nhé.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#78ad44]" size={60} /></div>;

  if (!vehicle) return (
    <div className="h-screen flex flex-col items-center justify-center p-10 text-center bg-white">
      <h1 className="text-9xl font-black text-gray-100 italic">404</h1>
      <p className="text-xl font-bold text-gray-400 mt-4 mb-8 uppercase tracking-widest">Không tìm thấy chiếc xe này!</p>
      <button onClick={() => navigate('/search')} className="bg-[#78ad44] text-white px-10 py-4 rounded-2xl font-black shadow-lg">BACK TO FLEET</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <header className="p-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black text-gray-400 hover:text-black transition-colors uppercase tracking-widest text-xs">
          <ChevronLeft size={16} /> BACK TO FLEET
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Cột trái: Ảnh và Thông tin xe */}
        <div>
          <span className="bg-[#78ad44]/10 text-[#78ad44] px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">AVAILABLE</span>
          <h1 className="text-7xl font-black text-gray-900 mt-4 mb-2 tracking-tighter">{vehicle.brand}</h1>
          <p className="text-2xl font-bold text-gray-300 mb-10 uppercase tracking-[0.3em]">{vehicle.model} — {vehicle.plateNumber}</p>
          <img src={vehicle.imageUrl} className="w-full h-[550px] object-cover rounded-[3rem] shadow-2xl" alt="car" />
        </div>

        {/* Cột phải: Form đặt xe */}
        <div className="pt-20">
          <div className="bg-[#F8F9FA] p-12 rounded-[3.5rem] border border-gray-100 sticky top-10">
            {bookedSuccess ? (
              <div className="text-center py-10 animate-in fade-in duration-500">
                <CheckCircle2 size={60} className="text-[#78ad44] mx-auto mb-6" />
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">ĐẶT XE THÀNH CÔNG!</h3>
                <p className="text-gray-500 font-medium mb-8 uppercase text-xs tracking-widest leading-relaxed">Chúng tôi sẽ sớm gọi cho cậu qua số <br/><span className="text-black font-black">{phoneNumber}</span></p>
                <button onClick={() => navigate('/search')} className="w-full bg-black text-white py-5 rounded-2xl font-black hover:scale-105 transition-all">TIẾP TỤC XEM XE</button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">Rental Investment</p>
                <h2 className="text-6xl font-black text-gray-900 mb-10 tracking-tighter italic">{vehicle.pricePerDay?.toLocaleString()}đ <span className="text-lg text-gray-300 uppercase">/day</span></h2>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center gap-4 focus-within:ring-2 focus-within:ring-[#78ad44]/20 transition-all shadow-sm">
                  <Phone className="text-[#78ad44]" size={20} />
                  <input 
                    type="text" 
                    placeholder="Nhập số điện thoại để đặt..." 
                    className="flex-1 bg-transparent outline-none font-bold text-lg text-gray-900 placeholder:text-gray-200"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={handleBooking}
                  disabled={isBooking}
                  className={`w-full py-6 rounded-2xl font-black text-xl shadow-xl transition-all uppercase tracking-widest ${
                    isBooking ? 'bg-gray-200 text-gray-400' : 'bg-[#78ad44] text-white hover:scale-[1.02] hover:shadow-[#78ad44]/30'
                  }`}
                >
                  {isBooking ? "Đang gửi..." : "Confirm Booking"}
                </button>
                
                <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-6 opacity-60">
                  <ShieldCheck size={14} className="text-[#78ad44]" /> 100% Secure & Insured Transaction
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}