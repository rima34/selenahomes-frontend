import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-serif font-light bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent mb-4">
            404
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-200/40"></div>
            <div className="w-2 h-2 rounded-full bg-amber-200/60"></div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-200/40"></div>
          </div>
        </div>
        <p className="text-2xl sm:text-3xl text-slate-300 mb-3 font-light">Page Not Found</p>
        <p className="text-base sm:text-lg text-slate-400 mb-8 font-light">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-amber-200 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-slate-900 rounded-xl px-6 py-6 font-semibold shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:shadow-[0_6px_24px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
            <Home className="w-5 h-5" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
