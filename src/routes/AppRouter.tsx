// Main router component
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import routes from "./index";
import LoadingSpinner from "@/components/LoadingSpinner";

// Create the router instance
const router = createBrowserRouter(routes);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AppRouter;