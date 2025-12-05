// Route configurations for the application
import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PropertyTypes from "@/pages/Property-types";
import DashboardStatsPage from "@/pages/Dashboard-stats";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Auth = lazy(() => import("@/pages/Auth"));
const Careers = lazy(() => import("@/pages/Careers"));
const DashboardHome = lazy(() => import("@/pages/DashboardHome"));
const Properties = lazy(() => import("@/pages/Properties"));
const DashboardStats = lazy(() => import("@/pages/Dashboard-stats"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const Applications = lazy(() => import("@/pages/Applications"));
const Registrations = lazy(() => import("@/pages/Registrations"));
const Calls = lazy(() => import("@/pages/Calls"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export const routes: RouteObject[] = [
  // Public routes (accessible without authentication)
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/careers",
    element: <Careers />,
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
  },
  
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardStats />,
      },
      {
        path: "stats",
        element: <DashboardStats />,
      },
      {
        path: "properties",
        element: <Properties />,
      },
      {
        path: "property-types",
        element: <PropertyTypes />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "applications",
        element: <Applications />,
      },
      {
        path: "registrations",
        element: <Registrations />,
      },
      {
        path: "calls",
        element: <Calls />,
      },
    ],
  },
  
  // Catch-all route for 404
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;