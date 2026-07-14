import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import DashboardNav from "@/components/DashboardNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuthContext";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [activeNav, setActiveNav] = useState("stats");

  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/properties")) {
      setActiveNav("properties");
    } else if (path.includes("/property-types")) {
      setActiveNav("property-types");
    } else if (path.includes("/jobs")) {
      setActiveNav("jobs");
    } else if (path.includes("/applications")) {
      setActiveNav("applications");
    } else if (path.includes("/registrations")) {
      setActiveNav("registrations");
    } else if (path.includes("/calls")) {
      setActiveNav("calls");
    } else {
      setActiveNav("stats");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);

    switch (navId) {
      case "stats":
        navigate("/dashboard/stats");
        break;

      case "properties":
        navigate("/dashboard/properties");
        break;

      case "property-types":
        navigate("/dashboard/property-types");
        break;

      case "jobs":
        navigate("/dashboard/jobs");
        break;

      case "applications":
        navigate("/dashboard/applications");
        break;

      case "registrations":
        navigate("/dashboard/registrations");
        break;

      case "calls":
        navigate("/dashboard/calls");
        break;

      default:
        navigate("/dashboard/stats");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-amber-200/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/dashboard/stats")}
              className="text-left text-2xl font-serif font-light tracking-[0.15em]"
              aria-label="Go to dashboard"
            >
              <span className="text-amber-200">SELENA</span>
              <span className="font-extralight text-white"> HOMES</span>
            </button>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="max-w-[220px] truncate text-sm font-light text-slate-300">
                {user?.email || "user@example.com"}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 border border-amber-200/20 bg-slate-800/60 text-amber-200 backdrop-blur-sm transition-all duration-300 hover:border-amber-200/40 hover:bg-amber-200/10 hover:text-amber-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <DashboardNav
        activeNav={activeNav}
        onNavClick={handleNavClick}
      />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
