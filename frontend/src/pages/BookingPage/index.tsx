import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../LandingPage/Header';
import Footer from '../LandingPage/Footer';
import { ChevronRight, Check, Loader2, UserCheck, CalendarDays, Clock } from 'lucide-react';

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center max-w-2xl mx-auto mb-12">
      <div className="flex items-center w-full">
        <div className={`flex flex-col items-center relative z-10 ${step >= 1 ? 'text-[#78ad44]' : 'text-gray-400'}`}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 bg-[#78ad44] text-white shadow-lg shadow-[#78ad44]/30">
            {step > 1 ? <Check size={18} /> : '1'}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Details</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${step >= 2 ? 'bg-[#78ad44]' : 'bg-gray-200'}`}></div>
        <div className={`flex flex-col items-center relative z-10 ${step >= 2 ? 'text-[#78ad44]' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${step >= 2 ? 'bg-[#78ad44] text-white shadow-lg shadow-[#78ad44]/30' : 'bg-gray-200 text-gray-500'}`}>
             {step > 2 ? <Check size={18} /> : '2'}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Confirm</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${step >= 3 ? 'bg-[#78ad44]' : 'bg-gray-200'}`}></div>
        <div className={`flex flex-col items-center relative z-10 ${step >= 3 ? 'text-[#78ad44]' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${step >= 3 ? 'bg-[#78ad44] text-white shadow-lg shadow-[#78ad44]/30' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Payment</span>
        </div>
      </div>
    </div>
  );
}

// Format datetime-local value to display string
function formatDisplayDate(dt: string) {
  if (!dt) return '—';
  const d = new Date(dt);
  return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vehicleId = searchParams.get('vehicleId');

  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecognized, setIsRecognized] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({ fullName: '', phone: '' });
  const [extras, setExtras] = useState({ insurance: true, childSeat: false });

  // --- THÊM MỚI: State cho ngày đặt xe ---
  // Mặc định: bắt đầu từ ngày mai, trả sau 3 ngày
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  const defaultEnd = new Date(tomorrow);
  defaultEnd.setDate(defaultEnd.getDate() + 3);

  const toLocalDatetimeInput = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [startDate, setStartDate] = useState(toLocalDatetimeInput(tomorrow));
  const [endDate, setEndDate] = useState(toLocalDatetimeInput(defaultEnd));
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCustomerInfo({ fullName: parsedUser.fullName || '', phone: parsedUser.phone || '' });
        setIsRecognized(true);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (vehicleId) {
      axios.get(`http://localhost:8080/api/vehicles/${vehicleId}`)
        .then(res => { setVehicle(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [vehicleId]);

  const handlePhoneBlur = async () => {
    const isPhoneValid = /^0\d{9}$/.test(customerInfo.phone);
    if (!isRecognized && isPhoneValid) {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/check-phone/${customerInfo.phone}`);
        if (res.data) {
          setCustomerInfo({ ...customerInfo, fullName: res.data.fullName });
          setIsRecognized(true);
        }
      } catch (e) { setIsRecognized(false); }
    }
  };

  // --- TÍNH SỐ NGÀY THUÊ VÀ TỔNG TIỀN ---
  const getRentalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return 0;
    // Tính số ngày (làm tròn lên, tối thiểu 1 ngày)
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  const rentalDays = getRentalDays();
  const basePricePerDay = vehicle?.pricePerDay || 0;
  const insuranceFee = extras.insurance ? 300000 : 0;
  const childSeatFee = extras.childSeat ? 150000 : 0;
  const serviceFee = 50000;
  const grandTotal = (basePricePerDay + insuranceFee + childSeatFee) * rentalDays + serviceFee;

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setDateError('');
    if (endDate && new Date(val) >= new Date(endDate)) {
      setDateError('Ngày trả phải sau ngày nhận!');
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setDateError('');
    if (startDate && new Date(val) <= new Date(startDate)) {
      setDateError('Ngày trả phải sau ngày nhận!');
    }
  };

  const handleConfirmBooking = async () => {
    if (!startDate || !endDate) {
      alert('Vui lòng chọn ngày nhận và trả xe!');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setDateError('Ngày trả phải sau ngày nhận!');
      return;
    }
    setIsSubmitting(true);
    const loggedInUser = JSON.parse(localStorage.getItem('user') || 'null');
    const payload = {
      vehicleId,
      customerPhone: customerInfo.phone,
      userId: loggedInUser?.id || null,
      startDateTime: new Date(startDate).toISOString(),
      endDateTime: new Date(endDate).toISOString(),
      totalAmount: grandTotal,
    };

    try {
      const res = await axios.post('http://localhost:8080/api/bookings', payload);
      alert(res.data.status === 'PENDING' ? "Đơn hàng đang chờ xác nhận!" : "Đơn hàng đã được xác nhận!");
      navigate(`/payment?amount=${grandTotal}&bookingId=${res.data.id}`);
    } catch {
      alert("Lỗi hệ thống khi tạo đơn!");
    } finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#78ad44]" size={48} /></div>;

  const isPhoneValid = /^0\d{9}$/.test(customerInfo.phone);
  const canSubmit = isPhoneValid && customerInfo.fullName.trim() !== '' && rentalDays > 0 && !dateError;

  // Ngày tối thiểu có thể chọn là từ hôm nay
  const todayStr = toLocalDatetimeInput(new Date());

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto w-full flex-1">
        <Stepper step={1} />
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-8">

            {/* === PHẦN CHỌN NGÀY THUÊ - MỚI === */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase italic flex items-center gap-2">
                <CalendarDays size={22} className="text-[#78ad44]" />
                Rental Period
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-700 ml-2 mb-2 block uppercase">
                    📅 Pickup Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    min={todayStr}
                    onChange={e => handleStartDateChange(e.target.value)}
                    className="w-full border-none rounded-2xl px-5 py-4 text-sm font-bold bg-[#f4f8f7] focus:ring-2 focus:ring-[#78ad44] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 ml-2 mb-2 block uppercase">
                    📅 Return Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    min={startDate || todayStr}
                    onChange={e => handleEndDateChange(e.target.value)}
                    className="w-full border-none rounded-2xl px-5 py-4 text-sm font-bold bg-[#f4f8f7] focus:ring-2 focus:ring-[#78ad44] focus:outline-none"
                  />
                </div>
              </div>

              {dateError && (
                <p className="mt-3 text-[11px] text-red-500 font-bold uppercase italic ml-2">⚠ {dateError}</p>
              )}

              {rentalDays > 0 && !dateError && (
                <div className="mt-4 flex items-center gap-2 bg-[#f4f8f7] rounded-2xl px-5 py-3 w-fit">
                  <Clock size={16} className="text-[#78ad44]" />
                  <span className="text-sm font-black text-gray-800 uppercase italic">
                    Duration: <span className="text-[#78ad44]">{rentalDays} day{rentalDays > 1 ? 's' : ''}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Driver Details */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase italic">Driver Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-700 ml-2 mb-2 block uppercase">Phone Number</label>
                  <input type="text" name="phone" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} onBlur={handlePhoneBlur} readOnly={isRecognized} placeholder="09xx xxx xxx" className={`w-full border-none rounded-2xl px-5 py-4 text-sm font-bold ${isRecognized ? 'bg-gray-100 text-gray-400' : 'bg-[#f4f8f7] focus:ring-2 focus:ring-[#78ad44]'}`} />
                  {customerInfo.phone.length > 0 && !isPhoneValid && <p className="text-[10px] text-red-500 font-bold mt-2 ml-2 uppercase italic">Invalid Phone (10 digits, starts with 0)</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 ml-2 mb-2 block uppercase">Full Name</label>
                  <input type="text" name="fullName" value={customerInfo.fullName} onChange={e => setCustomerInfo({...customerInfo, fullName: e.target.value})} readOnly={isRecognized} placeholder="Full Name" className={`w-full border-none rounded-2xl px-5 py-4 text-sm font-bold ${isRecognized ? 'bg-gray-100 text-[#78ad44]' : 'bg-[#f4f8f7] focus:ring-2 focus:ring-[#78ad44]'}`} />
                </div>
              </div>
              {isRecognized && <p className="mt-4 text-[10px] font-black text-[#78ad44] uppercase flex items-center gap-1"><UserCheck size={14}/> Recognized Member!</p>}
            </div>

            {/* Extras */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase italic">Extras</h2>
              <div className="space-y-4">
                <label className={`flex items-start p-5 rounded-2xl border-2 transition-all cursor-pointer ${extras.insurance ? 'border-[#78ad44] bg-[#f4f8f7]' : 'border-gray-100'}`}>
                  <input type="checkbox" checked={extras.insurance} onChange={e => setExtras({...extras, insurance: e.target.checked})} className="mt-1 w-5 h-5 accent-[#78ad44]" />
                  <div className="ml-4 flex-1 flex justify-between font-black uppercase text-sm italic">
                    <span>Full Protection</span>
                    <span className="text-[#78ad44]">300,000đ/day</span>
                  </div>
                </label>
                <label className={`flex items-start p-5 rounded-2xl border-2 transition-all cursor-pointer ${extras.childSeat ? 'border-[#78ad44] bg-[#f4f8f7]' : 'border-gray-100'}`}>
                  <input type="checkbox" checked={extras.childSeat} onChange={e => setExtras({...extras, childSeat: e.target.checked})} className="mt-1 w-5 h-5 accent-[#78ad44]" />
                  <div className="ml-4 flex-1 flex justify-between font-black uppercase text-sm italic">
                    <span>Child Seat</span>
                    <span className="text-[#78ad44]">150,000đ/day</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-24 bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 flex flex-col gap-4">
              <h3 className="text-xl font-black text-gray-900 border-b pb-4 uppercase italic">Order Summary</h3>

              {/* Xe */}
              {vehicle && (
                <div className="flex items-center gap-3 bg-[#f4f8f7] rounded-2xl p-4">
                  <img src={vehicle.imageUrl} alt={vehicle.brand} className="w-16 h-12 object-cover rounded-xl" />
                  <div>
                    <p className="font-black text-sm text-gray-900 uppercase">{vehicle.brand} {vehicle.model}</p>
                    {vehicle.plateNumber && (
                      <p className="text-xs font-bold text-[#78ad44] uppercase">{vehicle.plateNumber}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Chi tiết giá */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 font-bold">
                  <span>Rental ({rentalDays} ngày × {(basePricePerDay).toLocaleString()}đ)</span>
                  <span>{(basePricePerDay * rentalDays).toLocaleString()}đ</span>
                </div>
                {extras.insurance && (
                  <div className="flex justify-between text-gray-600 font-bold">
                    <span>Insurance ({rentalDays} ngày × 300,000đ)</span>
                    <span>{(insuranceFee * rentalDays).toLocaleString()}đ</span>
                  </div>
                )}
                {extras.childSeat && (
                  <div className="flex justify-between text-gray-600 font-bold">
                    <span>Child Seat ({rentalDays} ngày × 150,000đ)</span>
                    <span>{(childSeatFee * rentalDays).toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 font-bold">
                  <span>Service Fee</span>
                  <span>{serviceFee.toLocaleString()}đ</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-2">
                  <div className="flex justify-between items-center text-lg font-black bg-[#212529] text-white p-5 rounded-2xl shadow-lg mt-2">
                    <span className="uppercase italic">Total</span>
                    <span className="text-[#78ad44]">{grandTotal.toLocaleString()}đ</span>
                  </div>
                </div>
              </div>

              <button
                disabled={isSubmitting || !canSubmit}
                onClick={handleConfirmBooking}
                className={`w-full text-white font-black uppercase tracking-[2px] rounded-2xl py-4 shadow-lg flex justify-center items-center gap-2 ${(!canSubmit || isSubmitting) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#78ad44] hover:bg-black transition-all'}`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Confirm & Pay <ChevronRight size={18} /></>}
              </button>

              {!canSubmit && rentalDays === 0 && (
                <p className="text-[10px] text-center text-red-400 font-bold uppercase">Hãy chọn ngày nhận và trả xe!</p>
              )}
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}