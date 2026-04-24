import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, CarFront, Star, MapPin } from 'lucide-react';
import Header from '@/pages/LandingPage/Header'; 
import { useSearchParams } from 'react-router-dom';


export default function SearchPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  useEffect(() => {
    axios.get('http://localhost:8080/api/vehicles')
         .then(res => setVehicles(res.data))
         .catch(err => console.error(err));
  }, []);

  const [searchParams] = useSearchParams();
  const brandParam = searchParams.get('brand');

  useEffect(() => {
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
  }, [brandParam]);

  // Danh sách địa điểm lấy động từ data xe
  const locations = ['All', ...Array.from(new Set(vehicles.map((v: any) => v.location).filter(Boolean))).sort()];
  const brands = ['All', ...Array.from(new Set(vehicles.map((v: any) => v.brand)))];

  // Logic lọc xe
  const filteredVehicles = vehicles.filter((v: any) => {
    const matchesSearch = v.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = v.pricePerDay <= maxPrice;
    const matchesBrand = selectedBrand === 'All' || v.brand === selectedBrand;
    const matchesLocation = selectedLocation === 'All' || v.location === selectedLocation;
    return matchesSearch && matchesPrice && matchesBrand && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <Header />

      <main className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-[#78ad44] font-black text-xs uppercase tracking-[0.4em] mb-3">Our Collection</p>
          <h1 className="text-5xl font-black text-gray-900 leading-tight">Explore Luxury <span className="text-[#78ad44]">Fleet</span></h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-6 h-fit sticky top-32">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 font-black text-gray-900 mb-8 uppercase text-xs tracking-widest">
                <SlidersHorizontal size={16} className="text-[#78ad44]"/> Filters
              </h3>
              
              <div className="space-y-8">

                {/* Filter: Địa điểm */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-wider flex items-center gap-1">
                    <MapPin size={11} className="text-[#78ad44]" /> Pickup Location
                  </p>
                  <div className="flex flex-col gap-2">
                    {locations.map(loc => (
                      <button
                        key={loc as string}
                        onClick={() => setSelectedLocation(loc as string)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                          selectedLocation === loc
                            ? 'bg-[#78ad44] text-white shadow-md shadow-[#78ad44]/20'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {loc !== 'All' && <MapPin size={11} />}
                        {loc as string}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter: Hãng xe */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-wider">Brands</p>
                  <div className="flex flex-wrap gap-2">
                    {brands.map(brand => (
                      <button 
                        key={brand as string}
                        onClick={() => setSelectedBrand(brand as string)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedBrand === brand ? 'bg-[#78ad44] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                      >
                        {brand as string}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter: Giá */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Max Price / Day</p>
                    <span className="text-xs font-black text-[#78ad44]">{maxPrice.toLocaleString()}đ</span>
                  </div>
                  <input 
                    type="range" min="500000" max="8000000" step="100000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#78ad44]"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 font-bold mt-1">
                    <span>500K</span><span>8M</span>
                  </div>
                </div>

              </div>
            </div>
          </aside>

          {/* List Vehicles */}
          <div className="flex-1">
            <div className="relative mb-6">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input 
                type="text" 
                placeholder="Search by brand, model or plate..." 
                className="w-full pl-16 pr-8 py-5 bg-white rounded-3xl shadow-sm border-none focus:ring-2 focus:ring-[#78ad44] font-medium text-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Kết quả */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
              {selectedLocation !== 'All' && <span className="text-[#78ad44] ml-2">· {selectedLocation}</span>}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredVehicles.map((v: any) => (
                <div key={v.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-gray-50 flex flex-col">
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img 
                      src={v.imageUrl} 
                      alt={v.model} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800'; }}
                    />
                    {/* Badge rating */}
                    <div className="absolute top-6 left-6 flex gap-2">
                       <span className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-sm">
                         <Star size={10} className="fill-yellow-400 text-yellow-400"/> 4.8
                       </span>
                    </div>
                    {/* Badge địa điểm */}
                    {v.location && (
                      <div className="absolute top-6 right-6">
                        <span className="bg-[#1a1c1e]/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
                          <MapPin size={10} className="text-[#78ad44]" />
                          {v.location}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-black text-[#78ad44] uppercase tracking-widest mb-1">{v.brand}</p>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{v.model}</h2>
                        {v.plateNumber && (
                          <span className="inline-flex items-center gap-1 mt-2 bg-[#f4f8f7] border border-[#78ad44]/30 text-[#78ad44] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            <CarFront size={11} />
                            {v.plateNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-xl font-black text-gray-900">{v.pricePerDay?.toLocaleString()}đ</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Per Day</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-6 border-y border-gray-50 mb-8 font-bold">
                       <div className="text-center">
                          <p className="text-[9px] text-gray-400 uppercase">Seats</p>
                          <p className="text-xs text-gray-900">05</p>
                       </div>
                       <div className="text-center border-x border-gray-50">
                          <p className="text-[9px] text-gray-400 uppercase">Gear</p>
                          <p className="text-xs text-gray-900">Auto</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[9px] text-gray-400 uppercase">Fuel</p>
                          <p className="text-xs text-gray-900">Petrol</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/booking?vehicleId=${v.id}`)}
                      className="w-full bg-[#78ad44] text-white py-3 rounded-xl font-bold hover:bg-black transition-all"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}

              {filteredVehicles.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center py-24 text-gray-300">
                  <CarFront size={64} strokeWidth={1} />
                  <p className="mt-4 font-black uppercase text-sm tracking-widest">No vehicles found</p>
                  <p className="text-xs mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}