import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BRANDS = [
  { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/120px-Toyota_carlogo.svg.png' },
  { name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/120px-Ford_logo_flat.svg.png' },
  { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/120px-Tesla_T_symbol.svg.png' },
  { name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/120px-Volkswagen_logo_2019.svg.png' },
  { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/120px-Honda_Logo.svg.png' },
  { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/120px-BMW.svg.png' },
  { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/120px-Mercedes-Logo.svg.png' },
  { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Hyundai_Motor_Company_logo.svg/120px-Hyundai_Motor_Company_logo.svg.png' },
  { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/120px-Audi-Logo_2016.svg.png' },
  { name: 'KIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia-logo.svg/120px-Kia-logo.svg.png' },
];

const BODY_TYPES = [
  { name: 'SUV', image: 'https://cdn-icons-png.flaticon.com/512/3201/3201826.png' },
  { name: 'Crossover', image: 'https://cdn-icons-png.flaticon.com/512/3201/3201817.png' },
  { name: 'Wagon', image: 'https://cdn-icons-png.flaticon.com/512/3201/3201830.png' },
  { name: 'Family MVP', image: 'https://cdn-icons-png.flaticon.com/512/3201/3201822.png' },
  { name: 'Sport Coupe', image: 'https://cdn-icons-png.flaticon.com/512/3201/3201804.png' },
  { name: 'Compact', image: 'https://cdn-icons-png.flaticon.com/512/3201/3201828.png' },
];

export default function BrandsSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-white pt-32 pb-12 md:pb-20 relative z-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rent by Brands */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl md:text-2xl font-black text-black">Rent by Brands</h2>
            <button 
              onClick={() => navigate('/search')} 
              className="text-xs font-bold text-gray-900 flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {BRANDS.map((brand, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/search?brand=${brand.name}`)}
                className="bg-[#f8f9fa] rounded-xl flex flex-col items-center justify-center p-6 hover:border-[#78ad44] border border-transparent transition-all cursor-pointer group"
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="h-8 object-contain mb-3 grayscale group-hover:grayscale-0" 
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-xs font-black text-gray-900">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rent by body type */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl md:text-2xl font-black text-black">Rent by body type</h2>
            <button 
              onClick={() => navigate('/search')} 
              className="text-xs font-bold text-gray-900 flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {BODY_TYPES.map((type, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/search?category=${type.name}`)}
                className="bg-[#f8f9fa] rounded-xl flex flex-col items-center justify-center p-5 hover:shadow-lg transition-all cursor-pointer group"
              >
                <img 
                  src={type.image} 
                  alt={type.name} 
                  className="h-12 mb-2 grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0" 
                />
                <span className="text-[10px] font-black uppercase tracking-wider">{type.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}