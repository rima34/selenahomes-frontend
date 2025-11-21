import Navbar from "@/components/Navbar";
import PropertySearch from "@/components/PropertySearch";
import FeaturedProperties from "@/components/FeaturedProperties";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import heroBg from "@/assets/hero-bg.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import { PropertyFilter } from "@/services/propertyService";
import { useState } from "react";

const Index = () => {
  const heroImages = [heroBg, property1, property2, property3];
  const [searchFilters, setSearchFilters] = useState<PropertyFilter>({});

  const handleSearch = (filters: PropertyFilter) => {
    setSearchFilters(filters);
    // Scroll to featured properties section
    document.getElementById("featured-properties")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Background */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
            }),
          ]}
          className="absolute inset-0 w-full h-full"
        >
          <CarouselContent>
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="relative w-full h-screen">
                <div
                  className="absolute inset-0 w-full h-full transition-transform duration-700"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-8 h-16 w-16 bg-slate-900/50 backdrop-blur-xl border border-amber-200/40 text-amber-100 hover:bg-amber-100 hover:text-slate-900 hover:border-amber-200 transition-all duration-300 shadow-[0_4px_16px_rgba(251,191,36,0.2)]" />
          <CarouselNext className="right-8 h-16 w-16 bg-slate-900/50 backdrop-blur-xl border border-amber-200/40 text-amber-100 hover:bg-amber-100 hover:text-slate-900 hover:border-amber-200 transition-all duration-300 shadow-[0_4px_16px_rgba(251,191,36,0.2)]" />
        </Carousel>

        {/* Glass Morphism Content Overlay */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-slate-900/30 via-slate-800/20 to-slate-900/30 backdrop-blur-2xl border border-amber-200/30 rounded-[2rem] p-16 shadow-[0_8px_32px_0_rgba(251,191,36,0.2)] max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-serif font-light text-white mb-2 tracking-[0.15em] drop-shadow-[0_4px_20px_rgba(251,191,36,0.3)]">
                <span className="block bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent">
                  SELENA
                </span>
              </h1>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-300/50"></div>
                <h2 className="text-3xl md:text-4xl font-serif font-extralight text-amber-100/90 tracking-[0.3em] italic">
                  HOMES
                </h2>
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-300/50"></div>
              </div>
              <p className="text-xs md:text-sm font-sans tracking-[0.4em] text-amber-200/70 uppercase">
                Real Estate
              </p>
            </div>
            <p className="text-xl md:text-2xl text-slate-100/90 mb-14 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
              Discover unparalleled luxury in Dubai's most prestigious addresses
            </p>
            <PropertySearch onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section id="featured-properties" className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-amber-200/20 rounded-[2rem] p-10 max-w-3xl mx-auto shadow-[0_8px_32px_0_rgba(251,191,36,0.15)]">
            <h2 className="text-5xl font-serif font-light tracking-[0.15em] bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent mb-4">
              Featured Properties
            </h2>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-200/40"></div>
              <div className="w-2 h-2 rounded-full bg-amber-200/60"></div>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-200/40"></div>
            </div>
            <p className="text-slate-300 text-lg font-light tracking-wide">
              Curated excellence in Dubai's luxury real estate
            </p>
          </div>

          <FeaturedProperties limit={6} showPagination={true} showRegister={true} filters={searchFilters} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/80 backdrop-blur-xl border-t border-amber-200/20 py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-3xl font-serif font-light tracking-[0.2em] mb-2">
                <span className="text-amber-200">SELENA</span>
                <span className="text-white font-extralight"> HOMES</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-200/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-200/60"></div>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-200/40"></div>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-slate-400 mb-2 font-light">
                Office 905 - Le Solarium Tower, Dubai Silicon Oasis
              </p>
              <p className="text-slate-400 mb-2 font-light">
                <a href="mailto:info@selenahomes.com" className="hover:text-amber-200 transition-colors">
                  info@selenahomes.com
                </a>
              </p>
              <p className="text-slate-400 font-light">
                <a href="tel:00971585494002" className="hover:text-amber-200 transition-colors">
                  +971-58-549-4002
                </a>
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-200/40"></div>
                <p className="text-slate-400 text-sm font-light tracking-wider">Follow Us</p>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-200/40"></div>
              </div>
              <div className="flex justify-center items-center gap-4">
                <a
                  href="https://www.linkedin.com/company/selena-homes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <Linkedin className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
                <a
                  href="https://twitter.com/selena_hom55936"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <FaXTwitter className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
                <a
                  href="https://www.instagram.com/selenahomesdubai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <Instagram className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
                <a
                  href="https://www.facebook.com/SelenaHomes0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <Facebook className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
                <a
                  href="https://www.tiktok.com/@selenahomess"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <FaTiktok className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <Youtube className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
              </div>
            </div>

            <div className="flex justify-center space-x-8 text-sm text-slate-400 font-light">
              <a href="/" className="hover:text-amber-200 transition-colors duration-300 tracking-wider">
                Home
              </a>
              <a href="/about" className="hover:text-amber-200 transition-colors duration-300 tracking-wider">
                About Us
              </a>
              <a href="/contact" className="hover:text-amber-200 transition-colors duration-300 tracking-wider">
                Contact
              </a>
              <a href="#" className="hover:text-amber-200 transition-colors duration-300 tracking-wider">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
