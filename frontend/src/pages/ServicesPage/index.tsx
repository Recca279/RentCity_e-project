import Header from '../LandingPage/Header';
import Footer from '../LandingPage/Footer';
import { Shield, Clock, MapPin, CreditCard, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ServicesPage() {
  const navigate = useNavigate();
  const services = [
    {
      icon: <Clock size={32} className="text-[#78ad44]" />,
      title: '24/7 Premium Support',
      desc: 'Our dedicated team is available around the clock to ensure your journey is flawless from start to finish.'
    },
    {
      icon: <Shield size={32} className="text-[#78ad44]" />,
      title: 'Comprehensive Insurance',
      desc: 'Every rental includes top-tier insurance coverage so you can drive with absolute peace of mind.'
    },
    {
      icon: <MapPin size={32} className="text-[#78ad44]" />,
      title: 'Flexible Delivery',
      desc: 'We can deliver your chosen luxury vehicle directly to your hotel, airport, or any preferred location.'
    },
    {
      icon: <Sparkles size={32} className="text-[#78ad44]" />,
      title: 'Chauffeur Service',
      desc: 'Elevate your experience by hiring one of our professional, discreet chauffeurs for your special events.'
    },
    {
      icon: <CreditCard size={32} className="text-[#78ad44]" />,
      title: 'Corporate Packages',
      desc: 'Optimized long-term rental solutions tailored for businesses, executives, and corporate fleets.'
    },
    {
      icon: <HeartHandshake size={32} className="text-[#78ad44]" />,
      title: 'Loyalty Rewards',
      desc: 'Join our Platinum Tier program and enjoy exclusive upgrades, priority bookings, and free miles.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4f8f7] text-[#78ad44] text-sm font-bold mb-6">
            <Sparkles size={16} /> Our Premium Services
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            Beyond just renting a car.<br />We deliver an experience.
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            Discover a suite of tailored services designed to make your journey extraordinary, comfortable, and absolutely seamless.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#78ad44]/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#f4f8f7] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-6 flex-1">{service.desc}</p>
              <button 
                onClick={() => navigate('/search')}
                className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#78ad44] group-hover:text-[#689938] transition-colors"
              >
                Learn more <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
