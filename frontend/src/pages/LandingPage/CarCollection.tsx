import { useState } from 'react';
import { MapPin, Settings, Users, Fuel, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TABS = ['Popular Car', 'Luxury Car', 'Vintage Car', 'Family Car', 'Off-Road Car'];

const CARS = [
  {
    id: '1',
    name: 'Audi A8 L 2022',
    price: 1500000, 
    seats: 5,
    fuel: 'Gasoline',
    transmission: 'Auto',
    miles: '4.8k',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop',
    category: 'Luxury Car',
  },
  {
    id: '2',
    name: 'Nissan Maxima Platinum 2022',
    price: 1200000,
    seats: 5,
    fuel: 'Gasoline',
    transmission: 'Auto',
    miles: '4.8k',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=600&auto=format&fit=crop',
    category: 'Popular Car',
    isMiddle: true, 
  },
  {
    id: '3',
    name: 'Porsche Cayenne GTS 2022',
    price: 3500000,
    seats: 5,
    fuel: 'Gasoline',
    transmission: 'Auto',
    miles: '4.8k',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
    category: 'Luxury Car',
  },
  {
    id: '4',
    name: 'BMW M8 Coupe 2022',
    price: 4000000,
    seats: 4,
    fuel: 'Gasoline',
    transmission: 'Auto',
    miles: '2.1k',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop',
    category: 'Popular Car',
  },
  {
    id: '5',
    name: 'BMW X7 M60i 2022',
    price: 3800000,
    seats: 7,
    fuel: 'Gasoline',
    transmission: 'Auto',
    miles: '5.5k',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=600&auto=format&fit=crop',
    category: 'Family Car',
  },
  {
    id: '6',
    name: 'Land Rover Defender 2023',
    price: 3200000,
    seats: 5,
    fuel: 'Diesel',
    transmission: 'Auto',
    miles: '1.2k',
    image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?q=80&w=600&auto=format&fit=crop',
    category: 'Off-Road Car',
  },
];

export default function CarCollection() {
  const [activeTab, setActiveTab] = useState('Popular Car');
  const navigate = useNavigate();

  const filteredCars = activeTab === 'Popular Car' 
    ? CARS.filter(c => c.category === 'Popular Car' || c.isMiddle) 
    : CARS.filter(c => c.category === activeTab);

  return (
    <section className="bg-[#f4f5f6] py-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading - Now in English */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Our Impressive Collection of Cars</h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm font-bold leading-relaxed uppercase tracking-wider">
            Ranging from elegant sedans to powerful sports cars, all carefully selected.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                activeTab === tab 
                ? 'bg-black text-white border-black shadow-lg shadow-black/20' 
                : 'bg-white text-gray-400 border-transparent hover:border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-[2.5rem] p-5 shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-50">
              <div className="rounded-[2rem] overflow-hidden mb-6 relative aspect-[4/3]">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
                  {car.category}
                </div>
              </div>

              <div className="px-2">
                <h3 className="font-black text-lg text-gray-900 mb-1">{car.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-xl font-black text-[#78ad44]">{car.price.toLocaleString()}đ</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">/ day</span>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-4 gap-2 mb-8 py-5 border-y border-dashed border-gray-100">
                  <div className="flex flex-col items-center gap-1">
                    <MapPin size={16} className="text-gray-900" />
                    <span className="text-[9px] font-black text-gray-400 uppercase">{car.miles}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Settings size={16} className="text-gray-900" />
                    <span className="text-[9px] font-black text-gray-400 uppercase">{car.transmission}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Users size={16} className="text-gray-900" />
                    <span className="text-[9px] font-black text-gray-400 uppercase">{car.seats} Seats</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Fuel size={16} className="text-gray-900" />
                    <span className="text-[9px] font-black text-gray-400 uppercase">Gas</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/booking?vehicleId=${car.id}`)}
                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[2px] transition-all ${
                    car.isMiddle 
                    ? 'bg-[#78ad44] text-white shadow-lg shadow-[#78ad44]/30 hover:bg-black' 
                    : 'bg-gray-900 text-white hover:bg-[#78ad44]'
                  }`}
                >
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show All */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-3 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 text-[11px] font-black uppercase tracking-[2px] px-10 py-4 rounded-2xl transition-all"
          >
            See all Cars <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}