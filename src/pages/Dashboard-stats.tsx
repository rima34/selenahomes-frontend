import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line, ResponsiveContainer, Area, AreaChart } from "recharts";
import { registerService } from "@/services/registerService";
import { propertyService } from "@/services/propertyService";
import { fetchJobs } from "@/services/jobService";
import { fetchApplications } from "@/services/applicationService";
import { PropertyStatus } from "@/types/property";
import { Register, ProfileType } from "@/types/register";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Calendar,
  DollarSign,
  UserCheck,
  Building2,
  Clock
} from "lucide-react";

interface MonthlyRegisterData {
  month: string;
  count: number;
}

interface PropertyStatusData {
  name: string;
  value: number;
  fill: string;
}

interface ProfileTypeData {
  name: string;
  value: number;
  fill: string;
}

interface PriceRangeData {
  range: string;
  count: number;
}

interface ApplicationTrendData {
  month: string;
  applications: number;
}

interface TopPropertyData {
  name: string;
  registrations: number;
}

interface RecentActivity {
  id: string;
  type: "registration" | "application" | "property";
  title: string;
  description: string;
  time: string;
}

interface KPIData {
  label: string;
  value: number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const COLORS = {
  [PropertyStatus.READY_TO_MOVE]: "#f59e0b", // amber
  [PropertyStatus.OFF_PLAN]: "#3b82f6", // blue
  [PropertyStatus.FOR_RENT]: "#10b981", // green
};

const PROFILE_COLORS = {
  [ProfileType.FIRST_TIME_BUYER]: "#8b5cf6", // purple
  [ProfileType.BROKER_AGENT]: "#ec4899", // pink
  [ProfileType.INVESTOR]: "#14b8a6", // teal
};

export default function DashboardStatsPage() {
  const [monthlyRegisters, setMonthlyRegisters] = useState<MonthlyRegisterData[]>([]);
  const [propertyStats, setPropertyStats] = useState<PropertyStatusData[]>([]);
  const [profileTypeStats, setProfileTypeStats] = useState<ProfileTypeData[]>([]);
  const [priceRangeStats, setPriceRangeStats] = useState<PriceRangeData[]>([]);
  const [applicationTrends, setApplicationTrends] = useState<ApplicationTrendData[]>([]);
  const [topProperties, setTopProperties] = useState<TopPropertyData[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [registersResponse, propertiesResponse, jobsResponse, applicationsResponse] = await Promise.all([
        registerService.getRegisters({}, { limit: 1000 }),
        propertyService.getAllProperties(),
        fetchJobs({}, { limit: 1000 }),
        fetchApplications({}, { limit: 1000 })
      ]);

      const registers = registersResponse.results || [];
      const properties = propertiesResponse || [];
      const jobs = jobsResponse.results || [];
      const applications = applicationsResponse.results || [];

      // Calculate KPIs
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      const lastMonthRegisters = registers.filter((r: Register) => new Date(r.createdAt) >= lastMonth && new Date(r.createdAt) < new Date(now.getFullYear(), now.getMonth(), 1));
      const currentMonthRegisters = registers.filter((r: Register) => new Date(r.createdAt) >= new Date(now.getFullYear(), now.getMonth(), 1));
      const registerChange = lastMonthRegisters.length > 0 ? ((currentMonthRegisters.length - lastMonthRegisters.length) / lastMonthRegisters.length) * 100 : 0;

      const activeJobs = jobs.length;
      const conversionRate = properties.length > 0 ? (registers.length / properties.length) * 100 : 0;

      setKpis([
        {
          label: "Total Properties",
          value: properties.length,
          change: 0,
          icon: Home,
          color: "from-blue-500 to-blue-600"
        },
        {
          label: "Total Registrations",
          value: registers.length,
          change: registerChange,
          icon: UserCheck,
          color: "from-amber-500 to-amber-600"
        },
        {
          label: "Job Applications",
          value: applications.length,
          change: 0,
          icon: FileText,
          color: "from-green-500 to-green-600"
        },
        {
          label: "Active Jobs",
          value: activeJobs,
          change: 0,
          icon: Briefcase,
          color: "from-purple-500 to-purple-600"
        },
        {
          label: "Conversion Rate",
          value: Number(conversionRate.toFixed(1)),
          change: 0,
          icon: TrendingUp,
          color: "from-pink-500 to-pink-600"
        },
        {
          label: "Avg. Price",
          value: properties.length > 0 ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length / 1000) : 0,
          change: 0,
          icon: DollarSign,
          color: "from-teal-500 to-teal-600"
        }
      ]);

      // Process registers by month
      const monthCounts: { [key: string]: number } = {};
      registers.forEach((register: Register) => {
        const date = new Date(register.createdAt);
        const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
      });

      const monthlyData = Object.entries(monthCounts)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => {
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(-6); // Last 6 months

      setMonthlyRegisters(monthlyData);

      // Count properties by status
      const statusCounts: { [key: string]: number } = {
        [PropertyStatus.READY_TO_MOVE]: 0,
        [PropertyStatus.OFF_PLAN]: 0,
        [PropertyStatus.FOR_RENT]: 0,
      };

      properties.forEach((property) => {
        if (property.status) {
          statusCounts[property.status] = (statusCounts[property.status] || 0) + 1;
        }
      });

      const propertyData: PropertyStatusData[] = [
        {
          name: "Ready to Move",
          value: statusCounts[PropertyStatus.READY_TO_MOVE],
          fill: COLORS[PropertyStatus.READY_TO_MOVE],
        },
        {
          name: "Off Plan",
          value: statusCounts[PropertyStatus.OFF_PLAN],
          fill: COLORS[PropertyStatus.OFF_PLAN],
        },
        {
          name: "For Rent",
          value: statusCounts[PropertyStatus.FOR_RENT],
          fill: COLORS[PropertyStatus.FOR_RENT],
        },
      ].filter((item) => item.value > 0);

      setPropertyStats(propertyData);

      // Count by profile type
      const profileCounts: { [key: string]: number } = {
        [ProfileType.FIRST_TIME_BUYER]: 0,
        [ProfileType.BROKER_AGENT]: 0,
        [ProfileType.INVESTOR]: 0,
      };

      registers.forEach((register: Register) => {
        if (register.profileType) {
          profileCounts[register.profileType] = (profileCounts[register.profileType] || 0) + 1;
        }
      });

      const profileData: ProfileTypeData[] = [
        {
          name: "First-Time Buyer",
          value: profileCounts[ProfileType.FIRST_TIME_BUYER],
          fill: PROFILE_COLORS[ProfileType.FIRST_TIME_BUYER],
        },
        {
          name: "Broker/Agent",
          value: profileCounts[ProfileType.BROKER_AGENT],
          fill: PROFILE_COLORS[ProfileType.BROKER_AGENT],
        },
        {
          name: "Investor",
          value: profileCounts[ProfileType.INVESTOR],
          fill: PROFILE_COLORS[ProfileType.INVESTOR],
        },
      ].filter((item) => item.value > 0);

      setProfileTypeStats(profileData);

      // Properties by price range
      const priceRanges = [
        { range: "<500K", min: 0, max: 500000 },
        { range: "500K-1M", min: 500000, max: 1000000 },
        { range: "1M-2M", min: 1000000, max: 2000000 },
        { range: "2M-5M", min: 2000000, max: 5000000 },
        { range: ">5M", min: 5000000, max: Infinity },
      ];

      const priceRangeData = priceRanges.map((range) => ({
        range: range.range,
        count: properties.filter((p) => p.price >= range.min && p.price < range.max).length,
      })).filter((item) => item.count > 0);

      setPriceRangeStats(priceRangeData);

      // Applications trend over time
      const appMonthCounts: { [key: string]: number } = {};
      applications.forEach((app) => {
        const date = new Date(app.createdAt);
        const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        appMonthCounts[monthYear] = (appMonthCounts[monthYear] || 0) + 1;
      });

      const appTrendData = Object.entries(appMonthCounts)
        .map(([month, applications]) => ({ month, applications }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
        .slice(-6);

      setApplicationTrends(appTrendData);

      // Top properties by registrations
      const propertyRegCount: { [key: string]: { name: string; count: number } } = {};
      registers.forEach((register: Register) => {
        if (register.propertyId && typeof register.propertyId === 'object') {
          const propId = register.propertyId.id;
          const propName = register.propertyId.name;
          if (!propertyRegCount[propId]) {
            propertyRegCount[propId] = { name: propName, count: 0 };
          }
          propertyRegCount[propId].count++;
        }
      });

      const topProps = Object.values(propertyRegCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((p) => ({ name: p.name, registrations: p.count }));

      setTopProperties(topProps);

      // Recent activities
      const activities: RecentActivity[] = [];

      registers.slice(-5).reverse().forEach((reg: Register) => {
        activities.push({
          id: reg.id,
          type: "registration",
          title: "New Registration",
          description: `${reg.fullName} registered as ${reg.profileType}`,
          time: formatTimeAgo(reg.createdAt),
        });
      });

      applications.slice(-3).reverse().forEach((app) => {
        activities.push({
          id: app.id,
          type: "application",
          title: "Job Application",
          description: `${app.fullName} applied for ${app.jobId.name}`,
          time: formatTimeAgo(app.createdAt),
        });
      });

      // Sort by time and take top 8
      activities.sort((a, b) => {
        // This is a simple sort, in production you'd want to use actual timestamps
        return 0;
      });

      setRecentActivities(activities.slice(0, 8));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-200 border-r-transparent"></div>
            <p className="mt-4 text-slate-300">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  const chartConfig = {
    count: {
      label: "Registrations",
      color: "#f59e0b",
    },
  };

  const pieChartConfig = {
    readyToMove: {
      label: "Ready to Move",
      color: COLORS[PropertyStatus.READY_TO_MOVE],
    },
    offPlan: {
      label: "Off Plan",
      color: COLORS[PropertyStatus.OFF_PLAN],
    },
    forRent: {
      label: "For Rent",
      color: COLORS[PropertyStatus.FOR_RENT],
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-light tracking-wide text-amber-200 mb-2">
            Dashboard Analytics
          </h1>
          <p className="text-slate-400">
            Comprehensive overview of your business metrics
          </p>
        </div>
        <Button
          onClick={fetchDashboardData}
          variant="outline"
          size="sm"
          className="gap-2 bg-slate-800/60 border-amber-200/20 text-amber-200 hover:bg-amber-200/10"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {kpi.change !== 0 && (
                    <div className={`flex items-center gap-1 text-xs ${kpi.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {kpi.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(kpi.change).toFixed(1)}%
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {kpi.label.includes("Price") ? `$${kpi.value}K` : 
                   kpi.label.includes("Rate") ? `${kpi.value}%` : 
                   kpi.value}
                </div>
                <div className="text-xs text-slate-400">{kpi.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Registrations Bar Chart */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Monthly Registrations
            </CardTitle>
            <CardDescription className="text-slate-400">
              Registration trends over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyRegisters.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={monthlyRegisters}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                No registration data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Status Pie Chart */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Property Distribution
            </CardTitle>
            <CardDescription className="text-slate-400">
              Properties by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {propertyStats.length > 0 ? (
              <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
                <PieChart>
                  <Pie
                    data={propertyStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                No property data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Type Distribution */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Client Profile Types
            </CardTitle>
            <CardDescription className="text-slate-400">
              Distribution by buyer category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profileTypeStats.length > 0 ? (
              <ChartContainer config={{}} className="h-[300px] w-full">
                <PieChart>
                  <Pie
                    data={profileTypeStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {profileTypeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                No profile data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications Trend */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Application Trends
            </CardTitle>
            <CardDescription className="text-slate-400">
              Job applications over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applicationTrends.length > 0 ? (
              <ChartContainer config={{}} className="h-[300px] w-full">
                <AreaChart data={applicationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#10b981"
                    fill="url(#colorApplications)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">
                No application data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Range Distribution */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Properties by Price Range
            </CardTitle>
            <CardDescription className="text-slate-400">
              Distribution across price segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {priceRangeStats.length > 0 ? (
              <ChartContainer config={{}} className="h-[280px] w-full">
                <BarChart data={priceRangeStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="range"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-slate-400">
                No price data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">
              Latest updates
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[280px] overflow-y-auto">
              {recentActivities.length > 0 ? (
                <div className="divide-y divide-slate-700/50">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 p-1.5 rounded-full ${
                          activity.type === 'registration' ? 'bg-amber-500/20' :
                          activity.type === 'application' ? 'bg-green-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          {activity.type === 'registration' ? <UserCheck className="w-3 h-3 text-amber-400" /> :
                           activity.type === 'application' ? <FileText className="w-3 h-3 text-green-400" /> :
                           <Home className="w-3 h-3 text-blue-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                          <p className="text-xs text-slate-400 truncate">{activity.description}</p>
                          <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-slate-400 px-4">
                  No recent activities
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Properties */}
      {topProperties.length > 0 && (
        <Card className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20 mt-6">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Performing Properties
            </CardTitle>
            <CardDescription className="text-slate-400">
              Properties with most registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px] w-full">
              <BarChart data={topProperties} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="registrations" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}