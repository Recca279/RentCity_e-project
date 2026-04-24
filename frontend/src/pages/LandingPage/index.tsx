import { useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import BrandsSection from './BrandsSection';
import CarCollection from './CarCollection';
import HowItWorks from './HowItWorks';
import Footer from './Footer';

export default function LandingPage() {
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <Hero />
      <BrandsSection />
      <CarCollection />
      <HowItWorks />
      <Footer />
    </div>
  );
}
