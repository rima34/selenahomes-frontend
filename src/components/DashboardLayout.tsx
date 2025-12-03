import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuthContext";
import DashboardNav from "@/components/DashboardNav";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("stats");

  useEffect(() => {
    // Set active nav based on current path
    const path = location.pathname;
    if (path.includes('/stats')) {
      setActiveNav('stats');
    } else if (path.includes('/properties')) {
      setActiveNav('properties');
    } else if (path.includes('/property-types')) {
      setActiveNav('property-types');
    } else if (path.includes('/jobs')) {
      setActiveNav('jobs');
    } else if (path.includes('/applications')) {
      setActiveNav('applications');
    } else if (path.includes('/registrations')) {
      setActiveNav('registrations');
    } else if (path.includes('/calls')) {
      setActiveNav('calls');
    } else {
      setActiveNav('stats');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    // Navigate to different sections
    switch (navId) {
      case 'properties':
        navigate('/dashboard/properties');
        break;
      case 'property-types':
        navigate('/dashboard/property-types');
        break;
      case 'jobs':
        navigate('/dashboard/jobs');
        break;
      case 'applications':
        navigate('/dashboard/applications');
        break;
      case 'registrations':
        navigate('/dashboard/registrations');
        break;
      case 'calls':
        navigate('/dashboard/calls');
        break;
      case 'stats':
        navigate('/dashboard/stats');
        break;
      default:
        navigate('/dashboard/properties');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-amber-200/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-serif font-light tracking-[0.15em]">
              <span className="text-amber-200">SELENA</span>
              <span className="text-white font-extralight"> HOMES</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300 font-light">
                {user?.email || "user@example.com"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 text-amber-200 hover:bg-amber-200/10 hover:border-amber-200/40 hover:text-amber-100 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <DashboardNav activeNav={activeNav} onNavClick={handleNavClick} />

      <Outlet />
    </div>
  );
};

export default DashboardLayout;