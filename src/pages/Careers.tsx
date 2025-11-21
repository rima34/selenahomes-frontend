import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/components/PaginationControls";
import * as jobService from "@/services/jobService";
import type { Job } from "@/services/jobService";
import { toast } from "sonner";
import { Briefcase, MapPin, Calendar, Search, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import ApplicationModal from "@/components/ApplicationModal";

const JOB_TYPES = [
  { value: "", label: "All Types" },
  { value: "full time", label: "Full Time" },
  { value: "part time", label: "Part Time" },
];

const CareersPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    location: "",
  });
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const filter: jobService.JobQueryFilter = {
        ...(filters.name && { name: filters.name }),
        ...(filters.type && (filters.type === "full time" || filters.type === "part time") && { 
          type: filters.type as "full time" | "part time" 
        }),
        ...(filters.location && { location: filters.location }),
      };
      const options = { page, limit, sortBy: "creationDate", order: "desc" as const };
      const data = await jobService.fetchJobs(filter, options);
      setJobs(data.results);
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error loading jobs";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setApplicationModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    toast.success("Application submitted successfully!");
    setApplicationModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-[0.15em] mb-4">
              <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent">
                CAREERS
              </span>
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-200/40"></div>
              <div className="w-2 h-2 rounded-full bg-amber-200/60"></div>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-200/40"></div>
            </div>
            <p className="text-xl text-slate-300 font-light tracking-wide max-w-2xl mx-auto">
              Join our team and be part of Dubai's premier real estate company
            </p>
            <div className="mt-6">
              <Badge className="bg-amber-200/20 text-amber-100 border border-amber-200/30 px-4 py-2 text-sm font-light">
                {totalResults} {totalResults === 1 ? 'Position' : 'Positions'} Available
              </Badge>
            </div>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-slate-900/40 backdrop-blur-xl border-amber-200/20 p-6">
                  <Skeleton className="h-6 w-24 mb-4 bg-slate-800/50" />
                  <Skeleton className="h-8 w-full mb-3 bg-slate-800/50" />
                  <Skeleton className="h-4 w-3/4 mb-2 bg-slate-800/50" />
                  <Skeleton className="h-4 w-1/2 mb-4 bg-slate-800/50" />
                  <Skeleton className="h-20 w-full mb-4 bg-slate-800/50" />
                  <Skeleton className="h-10 w-full bg-slate-800/50" />
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-16 h-16 text-amber-200/30 mx-auto mb-4" />
              <p className="text-xl text-slate-400 font-light">No job openings found</p>
              <p className="text-sm text-slate-500 mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="bg-slate-900/40 backdrop-blur-xl border border-amber-200/20 p-6 hover:border-amber-200/40 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(251,191,36,0.15)] group flex flex-col h-full"
                  >
                    <div className="mb-4">
                      <Badge
                        variant={job.type === "full time" ? "default" : "secondary"}
                        className={`${
                          job.type === "full time"
                            ? "bg-amber-200/20 text-amber-100 border-amber-200/30"
                            : "bg-slate-700/50 text-slate-300 border-slate-600/50"
                        } border font-light tracking-wide`}
                      >
                        {job.type === "full time" ? "Full Time" : "Part Time"}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-serif font-light text-amber-100 mb-3 tracking-wide group-hover:text-amber-200 transition-colors">
                      {job.name}
                    </h3>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-amber-200/50" />
                        <span className="font-light">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4 text-amber-200/50" />
                        <span className="font-light">
                          Posted {new Date(job.creationDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {job.description && (
                      <p className="text-sm text-slate-400 mb-6 line-clamp-3 font-light leading-relaxed">
                        {job.description}
                      </p>
                    )}

                    <Button
                      onClick={() => handleApply(job)}
                      className="w-full mt-auto bg-gradient-to-r from-amber-200/20 to-amber-100/20 border border-amber-200/30 text-amber-100 hover:from-amber-200/30 hover:to-amber-100/30 hover:border-amber-200/40 font-serif font-light tracking-wide"
                    >
                      Apply Now
                    </Button>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <PaginationControls
                    currentPage={page}
                    totalPages={totalPages}
                    totalResults={totalResults}
                    itemsPerPage={limit}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/80 backdrop-blur-xl border-t border-amber-200/20 py-16 px-4 mt-20">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-3xl font-serif font-light tracking-[0.2em] mb-2">
                <span className="text-amber-200">SELENA</span>
                <span className="text-white font-extralight"> HOMES</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-200/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-200/60"></div>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-200/40"></div>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-slate-400 mb-2 font-light">
                Office 905 - Le Solarium Tower, Dubai Silicon Oasis
              </p>
              <p className="text-slate-400 mb-2 font-light">
                <a href="mailto:info@selenahomes.com" className="hover:text-amber-200 transition-colors">
                  info@selenahomes.com
                </a>
              </p>
              <p className="text-slate-400 font-light">
                <a href="tel:00971585494002" className="hover:text-amber-200 transition-colors">
                  +971-58-549-4002
                </a>
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-200/40"></div>
                <p className="text-slate-400 text-sm font-light tracking-wider">Follow Us</p>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-200/40"></div>
              </div>
              <div className="flex justify-center items-center gap-4">
                <a
                  href="https://www.linkedin.com/company/selena-homes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <Linkedin className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
                <a
                  href="https://twitter.com/selena_hom55936"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <FaXTwitter className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
                <a
                  href="https://www.instagram.com/selenahomesdubai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <Instagram className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
                <a
                  href="https://www.facebook.com/SelenaHomes0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <Facebook className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
                <a
                  href="https://www.tiktok.com/@selenahomess"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <FaTiktok className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-slate-800/60 backdrop-blur-sm border border-amber-200/20 rounded-xl flex items-center justify-center hover:bg-amber-200/10 hover:border-amber-200/40 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(251,191,36,0.1)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
                >
                  <Youtube className="w-5 h-5 text-amber-200 group-hover:text-amber-100 transition-colors" />
                </a>
              </div>
            </div>

            <div className="flex justify-center space-x-8 text-sm text-slate-400 font-light">
              <a href="/" className="hover:text-amber-200 transition-colors duration-300 tracking-wider">
                Home
              </a>
              <a href="/about" className="hover:text-amber-200 transition-colors duration-300 tracking-wider">
                About Us
              </a>
              <a href="/careers" className="hover:text-amber-200 transition-colors duration-300 tracking-wider">
                Careers
              </a>
              <a href="/contact" className="hover:text-amber-200 transition-colors duration-300 tracking-wider">
                Contact
              </a>
              <a href="#" className="hover:text-amber-200 transition-colors duration-300 tracking-wider">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Application Modal */}
      {selectedJob && (
        <ApplicationModal
          open={applicationModalOpen}
          onClose={() => {
            setApplicationModalOpen(false);
            setSelectedJob(null);
          }}
          onSuccess={handleApplicationSuccess}
          job={selectedJob}
        />
      )}
    </div>
  );
};

export default CareersPage;
