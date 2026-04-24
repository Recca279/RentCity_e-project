import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../LandingPage/Header';
import Footer from '../LandingPage/Footer';
import { ChevronRight, Check, MapPin, Calendar, AlertCircle } from 'lucide-react';

const MOCK_CAR = {
  id: '1',
  name: 'Mercedes-Benz S-Class',
  price: 150,
  image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop',
};

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center max-w-2xl mx-auto mb-12">
      <div className="flex items-center w-full">
        <div className={`flex flex-col items-center relative z-10 ${step >= 1 ? 'text-[#78ad44]' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${step >= 1 ? 'bg-[#78ad44] text-white shadow-lg shadow-[#78ad44]/30' : 'bg-gray-200 text-gray-500'}`}>
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

export default function BookingConfirmPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        
        <Stepper step={2} />
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content */}
          <div className="flex-1 w-full space-y-8">
            
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Review Reservation</h2>
              <p className="text-sm font-medium text-gray-500 mb-8">Please check all details before proceeding to payment.</p>
              
              <div className="space-y-6">
                
                <div className="p-5 border border-gray-100 rounded-2xl bg-[#f4f8f7]">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm font-medium">
                    <div><span className="text-gray-400 block mb-1">Name</span><span className="text-gray-900">John Doe</span></div>
                    <div><span className="text-gray-400 block mb-1">Email</span><span className="text-gray-900">johndoe@example.com</span></div>
                    <div><span className="text-gray-400 block mb-1">Phone</span><span className="text-gray-900">+1 234 567 890</span></div>
                  </div>
                </div>

                <div className="p-5 border border-gray-100 rounded-2xl bg-[#f4f8f7]">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Selected Extras</h3>
                  <ul className="space-y-2 text-sm font-medium text-gray-700">
                    <li className="flex items-center gap-2"><Check size={16} className="text-[#78ad44]" /> Full Protection Insurance</li>
                    <li className="flex items-center gap-2 text-gray-400"><XIcon /> Child Seat (Not selected)</li>
                  </ul>
                </div>

                <div className="p-5 border border-[#78ad44]/30 rounded-2xl bg-[#78ad44]/5 flex items-start gap-4">
                  <AlertCircle className="text-[#78ad44] shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Cancellation Policy</h4>
                    <p className="text-xs font-medium text-gray-600 mt-1 leading-relaxed">Free cancellation up to 48 hours before pick-up. If you cancel less than 48 hours in advance, a cancellation fee of 50% will apply.</p>
                  </div>
                </div>

                <label className="flex items-start gap-3 mt-6 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-5 h-5 rounded border-gray-300 text-[#78ad44] focus:ring-[#78ad44] accent-[#78ad44]" />
                  <span className="text-sm font-medium text-gray-600 leading-relaxed">
                    I have read and agree to the <a href="#" className="text-[#78ad44] hover:underline font-bold">Terms and Conditions</a> and <a href="#" className="text-[#78ad44] hover:underline font-bold">Privacy Policy</a>.
                  </span>
                </label>

              </div>
            </div>

          </div>

          {/* Sidebar Summary */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-24 bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 flex flex-col gap-6">
              <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-4 px-2">Order Summary</h3>
              
              <div className="flex gap-4 items-center bg-[#f4f8f7] p-3 rounded-2xl">
                <img src={MOCK_CAR.image} alt="car" className="w-24 h-16 object-cover rounded-xl shadow-sm" />
                <div>
                  <h4 className="font-black text-gray-900">{MOCK_CAR.name}</h4>
                  <p className="text-xs text-gray-500 font-bold mt-1">Luxury Sedan</p>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f4f8f7] flex items-center justify-center shrink-0 mt-0.5"><MapPin size={14} className="text-[#78ad44]" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400">Pick-up</p>
                    <p className="text-sm font-bold text-gray-900">JFK Airport, New York</p>
                    <p className="text-xs text-gray-500 mt-0.5">Oct 24, 2024 - 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f4f8f7] flex items-center justify-center shrink-0 mt-0.5"><Calendar size={14} className="text-[#78ad44]" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400">Drop-off</p>
                    <p className="text-sm font-bold text-gray-900">JFK Airport, New York</p>
                    <p className="text-xs text-gray-500 mt-0.5">Oct 27, 2024 - 10:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 px-2">
                <div className="flex justify-between items-center text-sm font-bold text-gray-600 mb-3">
                  <span>Car Rental (3 days)</span>
                  <span>${MOCK_CAR.price * 3}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-600 mb-3">
                  <span>Full Insurance</span>
                  <span>$90</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-600 mb-3">
                  <span>Taxes & Fees</span>
                  <span>$45</span>
                </div>
                
                <div className="flex justify-between items-center text-lg font-black text-gray-900 mt-6 bg-[#212529] text-white p-4 rounded-xl">
                  <span>Total</span>
                  <span className="text-[#78ad44]">$585</span>
                </div>
              </div>

              <button 
                disabled={!agreed}
                onClick={() => navigate(`/booking/${id || MOCK_CAR.id}/payment`)}
                className={`w-full text-white font-bold rounded-2xl py-4 transition-colors shadow-lg shadow-[#78ad44]/30 mt-2 flex justify-center items-center gap-2 ${agreed ? 'bg-[#78ad44] hover:bg-[#689938]' : 'bg-gray-300 cursor-not-allowed shadow-none'}`}
              >
                Proceed to Payment <ChevronRight size={18} />
              </button>
            </div>
          </aside>

        </div>
      </div>

      <Footer />
    </div>
  );
}

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
