import MobileNav from "@/components/MobileNav";
import { Building2, Users, Award, Target, Heart, Shield, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ownerImage from "@/assets/owner.png";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MobileNav />
      
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-4 tracking-[0.15em]">
              <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent">
                About Us
              </span>
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-200/40"></div>
              <div className="w-2 h-2 rounded-full bg-amber-200/60"></div>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-200/40"></div>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
              Building dreams, creating legacies
            </p>
          </div>
        </div>
      </section>
      <section className=" px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-amber-100/10 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 via-amber-100 to-white rounded-[2.5rem] opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-sm border-4 border-amber-200/40 rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_0_rgba(251,191,36,0.3)]">
                  <img
                    src={ownerImage}
                    alt="Leadership at Selena Homes"
                    className="w-full h-auto object-cover object-bottom"
                  />
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-200/10 rounded-full blur-2xl"></div>
                  <div className="absolute -top-6 -left-6 w-40 h-40 bg-amber-100/10 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-2xl border border-amber-200/30 rounded-[2rem] p-10 md:p-12 shadow-[0_8px_32px_0_rgba(251,191,36,0.2)]">
                <div className="mb-8">
                  <svg className="w-16 h-16 text-amber-200/30" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <blockquote className="space-y-6">
                  <p className="text-2xl md:text-3xl font-serif font-light text-slate-100 leading-relaxed italic">
                    Leadership isn't a title it's presence, vision, and action.
                  </p>
                  <p className="text-xl md:text-2xl font-serif font-light text-amber-200 leading-relaxed italic">
                    That's what makes buying from Selena… different
                  </p>
                </blockquote>
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-amber-200/60 to-transparent"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-200/60"></div>
                </div>
                <p className="mt-6 text-amber-100 font-serif font-light text-lg tracking-wider">
                  — Serine Achouri
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-2xl border border-amber-200/30 rounded-2xl sm:rounded-[2rem] p-6 sm:p-12 md:p-16 shadow-[0_8px_32px_0_rgba(251,191,36,0.2)]">
            <div className="text-center mb-6 sm:mb-12">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light tracking-[0.15em] bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent mb-4 sm:mb-6">
                Story About Selena Homes
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-amber-200/40"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-200/60"></div>
                <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-amber-200/40"></div>
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-slate-200 text-base sm:text-lg md:text-xl leading-relaxed mb-4 sm:mb-8 font-light">
                At Selena Homes, we don't just sell properties, we build dreams. We are a 
                Dubai-based real estate brokerage firm distinguished by our extensive expertise and 
                personalized approach that ensures you achieve your property aspirations.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                Whether you are looking to buy a new property or sell your existing one, our dedicated 
                team will be with you every step of the way to guarantee an exceptional 
                experience and satisfying results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-light tracking-[0.15em] bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent mb-4 sm:mb-6">
              Our Core Values
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-amber-200/40"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-200/60"></div>
              <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-amber-200/40"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-amber-200/20 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_16px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.25)] transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-200/20 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-light text-amber-100 tracking-wide">
                  Excellence
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                We strive for excellence in every transaction, ensuring the highest standards 
                of service and professionalism.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-amber-200/20 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_16px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.25)] transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-200/20 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-light text-amber-100 tracking-wide">
                  Trust
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Building lasting relationships through transparency, integrity, and 
                unwavering commitment to our clients.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-amber-200/20 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_16px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.25)] transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-200/20 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-light text-amber-100 tracking-wide">
                  Innovation
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Embracing cutting-edge technology and modern approaches to deliver 
                exceptional real estate solutions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-amber-200/20 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_16px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.25)] transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-200/20 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-light text-amber-100 tracking-wide">
                  Client-Focused
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Your dreams and aspirations are at the heart of everything we do, 
                ensuring personalized attention to every detail.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-amber-200/20 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_16px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.25)] transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-200/20 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-light text-amber-100 tracking-wide">
                  Expertise
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Years of experience in Dubai's real estate market, providing 
                invaluable insights and guidance.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-amber-200/20 rounded-xl sm:rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_16px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.25)] transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-200/20 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-light text-amber-100 tracking-wide">
                  Dedication
                </h3>
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Committed to being with you every step of the way, from initial 
                consultation to closing and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-2xl border border-amber-200/30 rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 md:p-16 shadow-[0_8px_32px_0_rgba(251,191,36,0.2)] text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light tracking-[0.15em] bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent mb-4 sm:mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-6 sm:mb-8 font-light leading-relaxed">
              Let our experienced team guide you through every step of your real estate journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:00971-58-549-4002"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-200 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-slate-900 rounded-2xl font-semibold shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:shadow-[0_6px_24px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-105"
              >
                Call Us Now
              </a>
              <a
                href="mailto:info@selenahomes.com"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-800/60 hover:bg-slate-800/80 text-amber-100 border border-amber-200/30 rounded-2xl font-semibold shadow-[0_4px_16px_rgba(251,191,36,0.2)] hover:shadow-[0_6px_24px_rgba(251,191,36,0.3)] transition-all duration-300 hover:scale-105"
              >
                Email Us
              </a>
            </div>
          </div>
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

export default About;
