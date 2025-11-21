import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Home, TrendingUp, Users } from "lucide-react";
import Properties from "./Properties";

const DashboardHome = () => {
  const stats = [
    {
      title: "Total Properties",
      value: "898",
      icon: Building2,
      description: "Active listings",
      color: "text-blue-600",
    },
    {
      title: "Properties Sold",
      value: "234",
      icon: Home,
      description: "This month",
      color: "text-green-600",
    },
    {
      title: "Revenue",
      value: "AED 45.2M",
      icon: TrendingUp,
      description: "+12% from last month",
      color: "text-primary",
    },
    {
      title: "Active Clients",
      value: "1,234",
      icon: Users,
      description: "Registered users",
      color: "text-purple-600",
    },
  ];

  return (
      <Properties />
  );
};

export default DashboardHome;