import Header from '../LandingPage/Header';
import Footer from '../LandingPage/Footer';
import { Users, Globe, MessageCircle, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommunityPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 bg-[#f8f9fa] border-b border-gray-100 relative overflow-hidden">
        {/* Decor text */}
        <div className="absolute top-10 left-[-5%] text-[15rem] font-black text-gray-900/[0.02] tracking-tighter pointer-events-none select-none">
          COMMUNITY
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-800 shadow-sm border border-gray-100 text-sm font-bold mb-6">
            <Users size={16} className="text-[#78ad44]" /> Join The Club
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            Welcome to the RentCity Community
          </h1>
          <p className="text-gray-600 font-medium text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Share your journeys, connect with other car enthusiasts, and get inspired for your next road trip across the country.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="bg-[#212529] hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              Become a Member <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="md:col-span-1 space-y-8">
            <div className="bg-[#f4f8f7] rounded-[2rem] p-8 border border-[#e9f2eb]">
              <Globe size={40} className="text-[#78ad44] mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-3">Global Reach</h3>
              <p className="text-gray-600 font-medium">Join over 100,000 members worldwide sharing their luxury driving experiences daily.</p>
            </div>
            
            <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
              <MessageCircle size={40} className="text-gray-900 mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-3">Active Forums</h3>
              <p className="text-gray-600 font-medium">Discuss routes, car reviews, and get exclusive tips from our community experts.</p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Recent Member Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { img: 'https://images.unsplash.com/photo-1469285994282-454ceb49e63c?auto=format&fit=crop&w=600&q=80', title: 'Roadtrip Across the Alps', user: 'Alexandra M.', time: '2 days ago' },
                { img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80', title: 'Sunset Drive in Malibu', user: 'John D.', time: '5 days ago' },
                { img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80', title: 'Weekend Getaway Guide', user: 'Sarah K.', time: '1 week ago' },
                { img: 'https://images.unsplash.com/photo-1441148345475-03a2e82f4602?auto=format&fit=crop&w=600&q=80', title: 'Renting a Vintage Classic', user: 'Michael P.', time: '2 weeks ago' }
              ].map((item, idx) => (
                <div key={idx} className="group cursor-pointer" onClick={() => navigate('/search')}>
                  <div className="w-full h-48 bg-gray-200 rounded-3xl mb-4 overflow-hidden relative">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Journey" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={12} className="text-yellow-500"/> 5.0
                    </div>
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 group-hover:text-[#78ad44] transition-colors">{item.title}</h4>
                  <p className="text-sm text-gray-500 font-medium mt-1">By {item.user} • {item.time}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
