import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/PaginationControls";
import * as applicationService from "@/services/applicationService";
import type { Application } from "@/types/application";
import { toast } from "sonner";
import { Trash2, Download, ExternalLink, FileText, Mail, Briefcase, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    fullName: "",
    emailAddress: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const filter = {
        ...(filters.fullName && { fullName: filters.fullName }),
        ...(filters.emailAddress && { emailAddress: filters.emailAddress }),
      };
      const options = { page, limit, sortBy: "createdAt", order: "desc" as const };
      const data = await applicationService.fetchApplications(filter, options);
      setApplications(data.results);
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error loading applications";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, [page, limit]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const handleDelete = (applicationId: string, applicantName: string) => {
    setApplicationToDelete({ id: applicationId, name: applicantName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!applicationToDelete) return;

    try {
      await applicationService.deleteApplication(applicationToDelete.id);
      toast.success("Application deleted successfully");
      fetchApplications();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error deleting application";
      toast.error(errorMsg);
    }
  };

  const handleDownloadCv = async (cvPath: string, applicantName: string) => {
    try {
      const fileName = `${applicantName.replace(/\s+/g, "_")}_CV.pdf`;
      await applicationService.downloadCv(cvPath, fileName);
      toast.success("CV downloaded successfully");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error downloading CV";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-light tracking-wide bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent">
          Job Applications
        </h1>
        <Badge variant="secondary" className="text-sm bg-amber-200/10 text-amber-100 border-amber-200/20">
          {totalResults} Total Applications
        </Badge>
      </div>

      <form className="flex flex-wrap gap-4 mb-6" onSubmit={handleFilterSubmit}>
        <Input
          name="fullName"
          placeholder="Applicant name"
          value={filters.fullName}
          onChange={handleFilterChange}
          className="w-64 bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
        />
        <Input
          name="emailAddress"
          placeholder="Email address"
          value={filters.emailAddress}
          onChange={handleFilterChange}
          className="w-64 bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
        />
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-amber-200/20 border border-amber-200/40 text-amber-100 hover:bg-amber-200/30 font-serif font-light tracking-wide"
        >
          {loading ? "Loading..." : "Filter"}
        </Button>
        {(filters.fullName || filters.emailAddress) && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFilters({ fullName: "", emailAddress: "" });
              setPage(1);
            }}
            className="bg-slate-800/60 border-amber-200/20 text-slate-100 hover:bg-slate-800 hover:border-amber-200/40"
          >
            Clear Filters
          </Button>
        )}
      </form>

      <div className="grid gap-4">
        {applications.length === 0 && !loading && (
          <div className="text-center text-slate-400 py-8">
            No applications found.
          </div>
        )}
        {applications.map((application) => (
          <Card key={application.id} className="p-6 bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl text-amber-100 font-serif font-light tracking-wide">{application.fullName}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                      <Mail className="w-4 h-4" />
                      {application.emailAddress}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Applied for:</span>
                    <span>{application.jobId?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-amber-200/10 text-amber-100 border-amber-200/20">
                      {application.yearsOfExperience} years experience
                    </Badge>
                  </div>
                  {application.jobId?.type && (
                    <Badge variant="secondary" className="bg-amber-200/10 text-amber-100 border-amber-200/20">{application.jobId.type}</Badge>
                  )}
                  {application.jobId?.location && (
                    <span className="text-slate-400">📍 {application.jobId.location}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="w-4 h-4" />
                  Applied: {new Date(application.createdAt).toLocaleDateString()}
                </div>

                {application.linkedinLink && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-amber-200 hover:text-amber-100"
                      onClick={() => window.open(application.linkedinLink, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View LinkedIn Profile
                    </Button>
                  </div>
                )}

                {application.coverLetterText && (
                  <div className="mt-2 p-3 bg-slate-800/40 rounded-md border border-amber-200/10">
                    <div className="flex items-center gap-2 text-sm font-medium mb-2 text-amber-100">
                      <FileText className="w-4 h-4" />
                      Cover Letter
                    </div>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">
                      {application.coverLetterText}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex lg:flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadCv(application.uploadedCvPath, application.fullName)}
                  className="gap-2 flex-1 lg:flex-none bg-slate-800/60 border-amber-200/20 text-amber-100 hover:bg-slate-800 hover:border-amber-200/40"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(application.id, application.fullName)}
                  className="gap-2 flex-1 lg:flex-none bg-red-900/40 border border-red-400/40 text-red-200 hover:bg-red-900/60"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {applications.length > 0 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalResults={totalResults}
          itemsPerPage={limit}
          onPageChange={setPage}
          disabled={loading}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Application"
        description="Are you sure you want to delete this application? This action cannot be undone."
        itemName={applicationToDelete?.name}
      />
    </div>
  );
};

export default ApplicationsPage;
