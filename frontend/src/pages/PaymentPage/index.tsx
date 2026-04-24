import { useState } from 'react'; // Xóa useEffect vì không dùng
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../LandingPage/Header';
import Footer from '../LandingPage/Footer';
import { Check, CreditCard, Wallet, Lock } from 'lucide-react';

// Sửa Stepper: Xóa biến 'step' thừa để hết báo vàng
function Stepper() {
  return (
    <div className="flex items-center justify-center max-w-2xl mx-auto mb-12">
      <div className="flex items-center w-full">
        <div className="flex flex-col items-center relative z-10 text-[#78ad44]">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#78ad44] text-white shadow-lg shadow-[#78ad44]/30">
            <Check size={18} />
          </div>
          <span className="text-[10px] font-black uppercase mt-2 tracking-widest">Details</span>
        </div>
        <div className="flex-1 h-1 mx-4 bg-[#78ad44] rounded-full"></div>
        <div className="flex flex-col items-center relative z-10 text-[#78ad44]">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#78ad44] text-white shadow-lg shadow-[#78ad44]/30">
             <Check size={18} />
          </div>
          <span className="text-[10px] font-black uppercase mt-2 tracking-widest">Confirm</span>
        </div>
        <div className="flex-1 h-1 mx-4 bg-[#78ad44] rounded-full"></div>
        <div className="flex flex-col items-center relative z-10 text-[#78ad44]">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-[#78ad44] text-white shadow-xl shadow-[#78ad44]/40 ring-4 ring-white">
            3
          </div>
          <span className="text-[10px] font-black uppercase mt-2 tracking-widest">Payment</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const amount = searchParams.get('amount') || '0';
  const bookingId = searchParams.get('bookingId');
  
  const [method, setMethod] = useState<'card'|'vnpay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const isFormValid = method === 'vnpay' || (cardName.trim().length > 2 && cardNumber.trim().length >= 10);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (bookingId) {
        // QUAN TRỌNG: Sửa lại đường dẫn API cho khớp với Backend mình vừa quy hoạch
        // Chuyển status sang CONFIRMED để xe tự động sang trạng thái RENTED
        await axios.patch(`http://localhost:8080/api/bookings/${bookingId}/status?status=CONFIRMED`);
      }
      
      // Giả lập thời gian xử lý thanh toán
      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/payment/result?status=success&amount=${amount}`);
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert("Thanh toán thất bại hoặc đơn hàng không tồn tại!");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] flex flex-col font-sans">
      <Header />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-1">
        <Stepper />
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-[#78ad44] rounded-full"></div>
                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Secure Checkout</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <button 
                  onClick={() => setMethod('card')}
                  className={`relative p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${method === 'card' ? 'border-[#78ad44] bg-[#78ad44]/5 text-[#78ad44]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                  <CreditCard size={32} />
                  <span className="font-black text-xs uppercase tracking-widest">Credit / Debit Card</span>
                  {method === 'card' && <div className="absolute -top-2 -right-2 bg-[#78ad44] text-white rounded-full p-1 shadow-lg"><Check size={14}/></div>}
                </button>
                <button 
                  onClick={() => setMethod('vnpay')}
                  className={`relative p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${method === 'vnpay' ? 'border-[#78ad44] bg-[#78ad44]/5 text-[#78ad44]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                >
                  <Wallet size={32} />
                  <span className="font-black text-xs uppercase tracking-widest">VNPay / E-Wallet</span>
                  {method === 'vnpay' && <div className="absolute -top-2 -right-2 bg-[#78ad44] text-white rounded-full p-1 shadow-lg"><Check size={14}/></div>}
                </button>
              </div>

              {method === 'card' ? (
                <div className="space-y-6">
                  <div className="relative group">
                    <label className="text-[10px] font-black text-gray-400 ml-5 mb-2 block uppercase tracking-[2px]">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="NGUYEN VAN A" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#78ad44] focus:bg-white rounded-2xl px-6 py-4.5 text-sm outline-none font-bold uppercase transition-all shadow-sm" 
                    />
                  </div>
                  <div className="relative group">
                    <label className="text-[10px] font-black text-gray-400 ml-5 mb-2 block uppercase tracking-[2px]">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      maxLength={16}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-[#78ad44] focus:bg-white rounded-2xl px-6 py-4.5 text-sm outline-none font-bold transition-all shadow-sm" 
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-[#f4f8f7] rounded-3xl p-8 text-center border-2 border-dashed border-[#78ad44]/20">
                   <p className="font-black text-gray-900 uppercase italic tracking-tighter">Redirect to VNPay Gateway</p>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="bg-[#1a1c1e] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-white">
              <h3 className="font-black text-xs uppercase tracking-[3px] mb-8 flex items-center gap-2">
                <Lock size={14} className="text-[#78ad44]" /> Order Summary
              </h3>
              <div className="mb-10">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-[4px]">Final Amount</span>
                <div className="text-4xl font-black text-[#78ad44] tracking-tighter mt-1 italic">
                  {Number(amount).toLocaleString()}<span className="text-xl ml-1">₫</span>
                </div>
              </div>
              <button 
                onClick={handlePayment}
                disabled={!isFormValid || isProcessing}
                className={`w-full h-16 rounded-2xl font-black uppercase tracking-[2px] transition-all
                  ${(!isFormValid || isProcessing) 
                    ? 'bg-white/10 text-white/20 cursor-not-allowed' 
                    : 'bg-[#78ad44] text-white hover:bg-white hover:text-[#78ad44] active:scale-95'}`}
              >
                {isProcessing ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}