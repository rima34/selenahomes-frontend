// Route configurations for the application
import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PropertyTypes from "@/pages/Property-types";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Auth = lazy(() => import("@/pages/Auth"));
const Careers = lazy(() => import("@/pages/Careers"));
const DashboardHome = lazy(() => import("@/pages/DashboardHome"));
const Properties = lazy(() => import("@/pages/Properties"));

const Jobs = lazy(() => import("@/pages/Jobs"));
const Applications = lazy(() => import("@/pages/Applications"));
const Registrations = lazy(() => import("@/pages/Registrations"));
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
        element: <DashboardHome />,
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
    ],
  },
  
  // Catch-all route for 404
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;