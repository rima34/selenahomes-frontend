import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Home, TrendingUp, Users, LogOut } from "lucide-react";
import { toast } from "sonner";
import authService from "@/services/authService";
import DashboardNav from "@/components/DashboardNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      toast.error("Please log in to access the dashboard");
      navigate("/auth");
      return;
    }

    const email = authService.getUserEmail();
    setUserEmail(email || "user@example.com");
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      authService.clearAuthData();
      toast.success("Logged out successfully");
      navigate("/");
    }
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
      default:
        // Stay on dashboard
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              <span className="text-primary">SELENA</span>
              <span className="text-foreground"> HOMES</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {userEmail}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <DashboardNav activeNav={activeNav} onNavClick={handleNavClick} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your real estate business.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest property listings and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "New property listed",
                  description: "Luxury Apartment in Downtown Dubai",
                  time: "2 hours ago",
                },
                {
                  title: "Property sold",
                  description: "Modern Villa in Palm Jumeirah",
                  time: "5 hours ago",
                },
                {
                  title: "New client inquiry",
                  description: "Interest in Penthouse - Dubai Marina",
                  time: "1 day ago",
                },
                {
                  title: "Property updated",
                  description: "Price reduced - Townhouse in Arabian Ranches",
                  time: "2 days ago",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
