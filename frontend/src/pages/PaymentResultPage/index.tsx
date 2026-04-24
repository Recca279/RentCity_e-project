import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../LandingPage/Header';
import Footer from '../LandingPage/Footer';
import { CheckCircle2, Copy, FileText, Smartphone, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const bookingIdFromUrl = searchParams.get('bookingId');
  const [displayContact, setDisplayContact] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  useEffect(() => {
    // 1. Kiểm tra xem có user đăng nhập không
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.email) {
        setDisplayContact(user.email);
        setIsEmail(true);
      } else {
        setDisplayContact(user.phone || 'your phone number');
        setIsEmail(false);
      }
    } else {
      // 2. Nếu khách vãng lai, hiển thị thông báo gửi qua SMS
      setDisplayContact("your registered phone number");
      setIsEmail(false);
    }

    // 3. Tạo mã Booking từ ID thật hoặc ngẫu nhiên
    if (bookingIdFromUrl) {
      setBookingCode('#RC-' + bookingIdFromUrl.substring(0, 5).toUpperCase());
    } else {
      setBookingCode('#RC-' + Math.floor(10000 + Math.random() * 90000));
    }
  }, [bookingIdFromUrl]);

  const copyCode = () => {
    navigator.clipboard.writeText(bookingCode);
    toast.success('Booking code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex items-center justify-center py-32 px-4">
        <div className="max-w-xl w-full bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl border border-gray-100 text-center relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#B4D581] opacity-20 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            <div className="w-24 h-24 bg-[#e9f2eb] rounded-full mx-auto flex items-center justify-center mb-8 border-4 border-white shadow-lg">
              <CheckCircle2 size={48} className="text-[#78ad44]" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4 uppercase italic">Payment Success!</h1>
            
            <div className="text-gray-500 font-medium mb-8 leading-relaxed max-w-sm mx-auto text-sm">
              <p>Your reservation has been confirmed.</p>
              <div className="flex items-center justify-center gap-2 mt-2 bg-gray-50 py-3 px-4 rounded-2xl border border-gray-100">
                {isEmail ? <Mail size={16} className="text-[#78ad44]" /> : <Smartphone size={16} className="text-[#78ad44]" />}
                <span className="text-gray-900 font-black uppercase tracking-tight text-xs">
                  {isEmail ? `Sent to: ${displayContact}` : `SMS sent to: ${displayContact}`}
                </span>
              </div>
            </div>

            <div className="bg-[#f4f8f7] p-6 rounded-3xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-100">
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Booking Reference</p>
                <p className="text-2xl font-black text-gray-900 tracking-wider">{bookingCode}</p>
              </div>
              <button 
                onClick={copyCode}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-gray-600 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl shadow-sm border border-gray-100 transition-all active:scale-95"
              >
                <Copy size={14} /> Copy
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/my-bookings')}
                className="flex-1 shrink-0 px-8 py-4 bg-[#212529] hover:bg-black text-white font-black uppercase text-xs tracking-[2px] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <FileText size={18} /> My Bookings
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex-1 shrink-0 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-black uppercase text-xs tracking-[2px] rounded-2xl transition-all border-2 border-gray-100 flex items-center justify-center gap-2"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}