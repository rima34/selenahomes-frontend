import { Button } from "@/components/ui/button";
import { Building2, Home, Settings, Briefcase, FileText, UserPlus, Phone } from "lucide-react";
import { MdDashboard } from "react-icons/md";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardNavProps {
  activeNav: string;
  onNavClick: (navId: string) => void;
}

const DashboardNav = ({ activeNav, onNavClick }: DashboardNavProps) => {
  const navigationItems: NavigationItem[] = [
    {
      id: "stats",
      label: "Dashboard",
      icon: MdDashboard,
    },
    {
      id: "properties",
      label: "Properties",
      icon: Building2,
    },
    {
      id: "property-types",
      label: "Property Types",
      icon: Settings,
    },
    {
      id: "jobs",
      label: "Jobs",
      icon: Briefcase,
    },
    {
      id: "applications",
      label: "Applications",
      icon: FileText,
    },
    {
      id: "registrations",
      label: "Contact & Lead Management",
      icon: UserPlus,
    },
    {
      id: "calls",
      label: "Calls & Visits Management",
      icon: Phone,
    },
  ];

  return (
    <nav className="bg-slate-900/60 backdrop-blur-xl border-b border-amber-200/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onNavClick(item.id)}
                className={`gap-2 px-4 py-2 rounded-t-lg rounded-b-none border-b-2 font-light tracking-wide transition-all cursor-pointer ${
                  isActive 
                    ? "border-amber-200 bg-amber-200/10 text-amber-100 hover:bg-amber-200/20" 
                    : "border-transparent text-slate-300 hover:border-amber-200/50 hover:text-amber-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;