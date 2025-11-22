import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Home, Info, Briefcase, Mail } from "lucide-react";
import logo from "@/assets/logo.webp";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Careers", path: "/careers", icon: Briefcase },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-amber-200/20 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 bg-slate-800/60 backdrop-blur-sm border border-amber-200/30 rounded-xl shadow-[0_2px_8px_rgba(251,191,36,0.2)] hover:bg-slate-700/60 transition-all duration-300 active:scale-95"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-amber-200" />
            ) : (
              <Menu className="w-5 h-5 text-amber-200" />
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            <img 
              src={logo} 
              alt="Selena Homes" 
              className="h-12 w-12 object-contain drop-shadow-lg" 
            />
          </Link>

          {/* Call Button */}
          <a
            href="tel:+971585494002"
            className="p-2 bg-gradient-to-r from-amber-200/10 to-amber-100/10 backdrop-blur-sm border border-amber-200/30 rounded-xl shadow-[0_2px_8px_rgba(251,191,36,0.2)] hover:from-amber-200/20 hover:to-amber-100/20 transition-all duration-300 active:scale-95"
            aria-label="Call us"
          >
            <Phone className="w-5 h-5 text-amber-200" />
          </a>
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden lg:block">
        <div className="fixed top-0 right-0 z-50 p-6">
          <Link to="/" className="block">
            <img 
              src={logo} 
              alt="Selena Homes" 
              className="h-32 w-32 object-contain drop-shadow-2xl transition-transform hover:scale-105" 
            />
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="fixed top-8 left-8 z-50 p-5 bg-slate-900/20 backdrop-blur-lg border border-amber-200/30 rounded-full shadow-[0_4px_16px_rgba(251,191,36,0.2)] hover:bg-slate-800/30 transition-all duration-300 hover:scale-110 group"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-amber-200 group-hover:rotate-90 transition-transform duration-300" />
          ) : (
            <Menu className="w-6 h-6 text-amber-200 group-hover:scale-110 transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <nav
        className={`fixed top-0 left-0 h-full w-full sm:w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-40 transform transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 lg:pt-24 px-6 sm:px-8">
          {/* Brand Name */}
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-light tracking-[0.15em]">
              <span className="text-amber-200">SELENA</span>
              <span className="text-white"> HOMES</span>
            </h2>
            <div className="h-[2px] w-20 sm:w-24 bg-gradient-to-r from-amber-200 to-amber-100 mt-2 sm:mt-3 rounded-full" />
          </div>

          {/* Navigation Links */}
          <ul className="space-y-1 sm:space-y-2 flex-1">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={toggleMenu}
                    className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-light text-slate-300 hover:text-amber-200 hover:bg-slate-800/50 rounded-xl transition-all duration-300 hover:translate-x-2 border border-transparent hover:border-amber-200/20 tracking-wide group"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <Icon className="w-5 h-5 text-amber-200/60 group-hover:text-amber-200 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA Button */}
          <div className="pb-6 sm:pb-8">
            <a href="tel:+971585494002">
              <Button
                className="w-full bg-gradient-to-r from-amber-200 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-slate-900 rounded-xl px-4 sm:px-6 py-5 sm:py-6 font-semibold text-sm sm:text-base shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:shadow-[0_6px_24px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 group"
                onClick={toggleMenu}
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                Request a Call
              </Button>
            </a>
            
            {/* Contact Info */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-slate-400 text-xs sm:text-sm mb-1 font-light">Need help?</p>
              <a 
                href="tel:+971585494002" 
                className="text-amber-200 text-sm sm:text-base font-semibold hover:text-amber-100 transition-colors"
              >
                +971-58-549-4002
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-amber-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 sm:w-40 h-32 sm:h-40 bg-amber-100/10 rounded-full blur-3xl" />
      </nav>
    </>
  );
};

export default MobileNav;
