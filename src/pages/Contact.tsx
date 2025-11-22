import { useState } from "react";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Send, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MobileNav />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-200/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 sm:mb-6">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-amber-200/40"></div>
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200" />
                <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-amber-200/40"></div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-[0.12em] sm:tracking-[0.15em] bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent mb-4 sm:mb-6">
              Get In Touch
            </h1>
            <p className="text-slate-300 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed px-4">
              Have questions about our luxury properties? We're here to help you find your dream home in Dubai.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Location Card */}
              <Card className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl border-amber-200/20 shadow-[0_4px_16px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.25)] transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6 text-amber-200" />
                  </div>
                  <CardTitle className="text-xl font-serif font-light text-amber-100">Our Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 font-light leading-relaxed">
                    Office 905 - Le Solarium Tower<br />
                    Dubai Silicon Oasis<br />
                    Dubai, UAE
                  </p>
                </CardContent>
              </Card>

              {/* Phone Card */}
              <Card className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl border-amber-200/20 shadow-[0_4px_16px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.25)] transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-3">
                    <Phone className="w-6 h-6 text-amber-200" />
                  </div>
                  <CardTitle className="text-xl font-serif font-light text-amber-100">Phone</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="tel:00971585494002" 
                    className="text-slate-300 font-light hover:text-amber-200 transition-colors duration-300 text-lg"
                  >
                    +971-58-549-4002
                  </a>
                </CardContent>
              </Card>

              {/* Email Card */}
              <Card className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl border-amber-200/20 shadow-[0_4px_16px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.25)] transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-200/10 rounded-xl flex items-center justify-center mb-3">
                    <Mail className="w-6 h-6 text-amber-200" />
                  </div>
                  <CardTitle className="text-xl font-serif font-light text-amber-100">Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="mailto:info@selenahomes.com" 
                    className="text-slate-300 font-light hover:text-amber-200 transition-colors duration-300"
                  >
                    info@selenahomes.com
                  </a>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl border-amber-200/20 shadow-[0_4px_16px_rgba(251,191,36,0.15)]">
                <CardHeader>
                  <CardTitle className="text-xl font-serif font-light text-amber-100">Follow Us</CardTitle>
                  <CardDescription className="text-slate-400 font-light">
                    Stay connected on social media
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://www.linkedin.com/company/selena-homes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-lg flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110"
                    >
                      <Linkedin className="w-5 h-5 text-amber-200" />
                    </a>
                    <a
                      href="https://twitter.com/selena_hom55936"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-lg flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110"
                    >
                      <FaXTwitter className="w-5 h-5 text-amber-200" />
                    </a>
                    <a
                      href="https://www.instagram.com/selenahomesdubai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-lg flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110"
                    >
                      <Instagram className="w-5 h-5 text-amber-200" />
                    </a>
                    <a
                      href="https://www.facebook.com/SelenaHomes0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-lg flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110"
                    >
                      <Facebook className="w-5 h-5 text-amber-200" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@selenahomess"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-lg flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110"
                    >
                      <FaTiktok className="w-5 h-5 text-amber-200" />
                    </a>
                    <a
                      href="https://www.youtube.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-lg flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110"
                    >
                      <Youtube className="w-5 h-5 text-amber-200" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl border-amber-200/20 shadow-[0_8px_32px_rgba(251,191,36,0.2)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif font-light text-amber-100">Send us a Message</CardTitle>
                  <CardDescription className="text-slate-300 font-light">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-300">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-slate-800/60 border-amber-200/30 text-white placeholder:text-slate-500 focus:border-amber-200 focus:ring-2 focus:ring-amber-200/30 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-300">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-slate-800/60 border-amber-200/30 text-white placeholder:text-slate-500 focus:border-amber-200 focus:ring-2 focus:ring-amber-200/30 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-slate-300">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="bg-slate-800/60 border-amber-200/30 text-white placeholder:text-slate-500 focus:border-amber-200 focus:ring-2 focus:ring-amber-200/30 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium text-slate-300">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="bg-slate-800/60 border-amber-200/30 text-white placeholder:text-slate-500 focus:border-amber-200 focus:ring-2 focus:ring-amber-200/30 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-slate-300">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your requirements..."
                        rows={6}
                        className="bg-slate-800/60 border-amber-200/30 text-white placeholder:text-slate-500 focus:border-amber-200 focus:ring-2 focus:ring-amber-200/30 transition-all duration-300 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-6 rounded-xl shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:shadow-[0_6px_24px_rgba(251,191,36,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Google Maps Section */}
          <div className="mt-16 max-w-7xl mx-auto">
            <Card className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl border-amber-200/20 shadow-[0_8px_32px_rgba(251,191,36,0.2)] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-light text-amber-100 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-amber-200" />
                  Find Us on the Map
                </CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Visit our office at Dubai Silicon Oasis
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-[450px] relative">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.98880669705!2d55.395017375368475!3d25.122296477759278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f65f580a85dfb%3A0x8d504b19ce1d3531!2sSelena%20Homes%20Real%20estate!5e1!3m2!1sen!2stn!4v1761599110869!5m2!1sen!2stn" 
                    width="100%" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
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

export default Contact;
