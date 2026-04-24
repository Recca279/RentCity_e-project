import { useState } from 'react';
import { MapPin, Calendar, Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  
  // Auto-fill logic for dates
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + 3);
  const futureStr = futureDate.toISOString().split('T')[0];

  const [pickup, setPickup] = useState('Hanoi, Vietnam');
  const [dropoff, setDropoff] = useState('Hanoi, Vietnam');
  const [pickupDate, setPickupDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(futureStr);

  const handleSearch = () => {
    navigate(`/search?location=${encodeURIComponent(pickup)}&startDate=${pickupDate}&endDate=${returnDate}`);
  };

  return (
    <section className="relative w-full bg-[#111111] pt-32 pb-64 flex flex-col items-center overflow-visible z-10">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1920&auto=format&fit=crop" 
          alt="Luxury Car Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 sm:bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>
      </div>

      {/* Slogan - English */}
      <h1 className="relative text-white text-4xl md:text-5xl lg:text-[54px] font-black text-center leading-[1.2] tracking-tight mb-8 px-4 z-10 pt-16 uppercase">
        Discover the world on wheels<br className="hidden md:block"/>
        with our car rental service
      </h1>

      {/* Search Bar */}
      <div className="absolute bottom-0 translate-y-1/2 w-full max-w-6xl px-4 z-20">
        <div className="bg-white rounded-[2.5rem] p-5 shadow-[0_25px_60px_rgb(0,0,0,0.18)] border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
            
            {/* Pick-up Location */}
            <div className="lg:col-span-3 w-full group">
              <label className="text-[11px] font-bold text-gray-500 mb-1.5 block px-4 uppercase tracking-[0.5px]">Pick-up Location</label>
              <div className="relative flex items-center bg-[#f8f9fa] rounded-2xl border border-transparent group-hover:border-gray-200 transition-all duration-300">
                <MapPin className="absolute left-4 text-[#78ad44] z-10" size={16} />
                <select 
                  value={pickup}
                  onChange={e => setPickup(e.target.value)}
                  className="w-full bg-transparent border-none text-black text-[13px] font-bold rounded-2xl pl-11 pr-10 py-4.5 outline-none focus:ring-0 cursor-pointer appearance-none relative z-0"
                >
                  <option value="Hanoi">Hanoi, Vietnam</option>
                  <option value="Ho Chi Minh City">Ho Chi Minh City</option>
                  <option value="Da Nang">Da Nang</option>
                  <option value="Hai Phong">Hai Phong</option>
                  <option value="Can Tho">Can Tho</option>
                </select>
                <ChevronDown className="absolute right-4 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Pick-up Date */}
            <div className="lg:col-span-3 w-full group">
              <label className="text-[11px] font-bold text-gray-500 mb-1.5 block px-4 uppercase tracking-[0.5px]">Pick-up date</label>
              <div className="relative flex items-center bg-[#f8f9fa] rounded-2xl border border-transparent group-hover:border-gray-200 transition-all duration-300">
                <Calendar className="absolute left-4 text-[#78ad44] z-10" size={16} />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={e => setPickupDate(e.target.value)}
                  onClick={e => e.currentTarget.showPicker()}
                  className="w-full bg-transparent border-none text-black text-[13px] font-bold rounded-2xl pl-11 pr-4 py-4.5 outline-none cursor-pointer [color-scheme:light]"
                />
              </div>
            </div>

            {/* Drop-off Location */}
            <div className="lg:col-span-2 w-full group">
              <label className="text-[11px] font-bold text-gray-500 mb-1.5 block px-4 uppercase tracking-[0.5px]">Drop-off</label>
              <div className="relative flex items-center bg-[#f8f9fa] rounded-2xl border border-transparent group-hover:border-gray-200 transition-all duration-300">
                <MapPin className="absolute left-4 text-gray-400 z-10" size={16} />
                <select 
                  value={dropoff}
                  onChange={e => setDropoff(e.target.value)}
                  className="w-full bg-transparent border-none text-black text-[13px] font-bold rounded-2xl pl-11 pr-10 py-4.5 outline-none focus:ring-0 cursor-pointer appearance-none relative z-0"
                >
                  <option value="Hanoi">Hanoi</option>
                  <option value="Ho Chi Minh City">Ho Chi Minh City</option>
                  <option value="Da Nang">Da Nang</option>
                </select>
                <ChevronDown className="absolute right-4 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Return Date */}
            <div className="lg:col-span-3 w-full group">
              <label className="text-[11px] font-bold text-gray-500 mb-1.5 block px-4 uppercase tracking-[0.5px]">Return date</label>
              <div className="relative flex items-center bg-[#f8f9fa] rounded-2xl border border-transparent group-hover:border-gray-200 transition-all duration-300">
                <Calendar className="absolute left-4 text-gray-400 z-10" size={16} />
                <input
                  type="date"
                  value={returnDate}
                  onChange={e => setReturnDate(e.target.value)}
                  onClick={e => e.currentTarget.showPicker()}
                  className="w-full bg-transparent border-none text-black text-[13px] font-bold rounded-2xl pl-11 pr-4 py-4.5 outline-none cursor-pointer [color-scheme:light]"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-1 w-full flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-black hover:bg-[#78ad44] text-white font-bold p-4.5 rounded-2xl transition-all shadow-xl flex items-center justify-center h-[52px]"
              >
                 <Search size={20} />
              </button>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}