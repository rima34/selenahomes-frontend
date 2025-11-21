import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.webp";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Top Bar with Logo */}
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

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleMenu}
        />
      )}

      {/* Slide-out Menu */}
      <nav
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-40 transform transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-8">
          {/* Brand Name */}
          <div className="m-12">
            <h2 className="text-3xl font-serif font-light tracking-[0.15em]">
              <span className="text-amber-200">SELENA</span>
              <span className="text-white"> HOMES</span>
            </h2>
            <div className="h-[2px] w-24 bg-gradient-to-r from-amber-200 to-amber-100 mt-3 rounded-full" />
          </div>

          {/* Navigation Links */}
          <ul className="space-y-2 flex-1 mx-12">
            {navLinks.map((link, index) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={toggleMenu}
                  className="block px-6 py-4 text-lg font-light text-slate-300 hover:text-amber-200 hover:bg-slate-800/50 rounded-xl transition-all duration-300 hover:translate-x-2 border border-transparent hover:border-amber-200/20 tracking-wide"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="pb-8">
            <Button
              className="w-full bg-gradient-to-r from-amber-200 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-slate-900 rounded-xl px-6 py-6 font-semibold shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:shadow-[0_6px_24px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 group"
              onClick={toggleMenu}
            >
              <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Request a Call
            </Button>
            
            {/* Contact Info */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm mb-1 font-light">Need help?</p>
              <a 
                href="tel:+971123456789" 
                className="text-amber-200 font-semibold hover:text-amber-100 transition-colors"
              >
                +971 12 345 6789
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-100/10 rounded-full blur-3xl" />
      </nav>
    </>
  );
};

export default Navbar;
