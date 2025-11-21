import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/PaginationControls";
import * as jobService from "@/services/jobService";
import type { Job } from "@/services/jobService";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import JobModal from "@/components/JobModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

const JOB_TYPES = [
  { value: "", label: "All Types" },
  { value: "full time", label: "Full Time" },
  { value: "part time", label: "Part Time" },
];

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    location: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<{ id: string; name: string } | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const filter: jobService.JobQueryFilter = {
        ...(filters.name && { name: filters.name }),
        ...(filters.type && (filters.type === "full time" || filters.type === "part time") && { type: filters.type as "full time" | "part time" }),
        ...(filters.location && { location: filters.location }),
      };
      const options = { page, limit, sortBy: "creationDate", order: "desc" as const };
      const data = await jobService.fetchJobs(filter, options);
      setJobs(data.results);
      setTotalPages(data.totalPages);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error loading jobs";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [page, limit]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleDelete = (jobId: string, jobName: string) => {
    setJobToDelete({ id: jobId, name: jobName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      await jobService.deleteJob(jobToDelete.id);
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error deleting job";
      toast.error(errorMsg);
    }
  };

  const handleCreateClick = () => {
    setSelectedJob(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedJob(null);
  };

  const handleModalSuccess = () => {
    fetchJobs();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-light tracking-wide bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent">
          Jobs
        </h1>
        <Button
          onClick={handleCreateClick}
          className="gap-2 bg-amber-200/20 border border-amber-200/40 text-amber-100 hover:bg-amber-200/30 font-serif font-light tracking-wide"
        >
          <Plus className="w-4 h-4" />
          Create Job
        </Button>
      </div>
      <form className="flex flex-wrap gap-4 mb-6" onSubmit={handleFilterSubmit}>
        <Input
          name="name"
          placeholder="Job name"
          value={filters.name}
          onChange={handleFilterChange}
          className="w-48 bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
        />
        <Input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="w-48 bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border border-amber-200/20 rounded px-2 py-1 bg-slate-800/60 text-slate-100 focus:border-amber-200/40 focus:ring-amber-200/20"
        >
          {JOB_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-slate-900 text-slate-100">{t.label}</option>
          ))}
        </select>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-amber-200/20 border border-amber-200/40 text-amber-100 hover:bg-amber-200/30 font-serif font-light tracking-wide"
        >
          {loading ? "Loading..." : "Filter"}
        </Button>
      </form>
      <div className="grid gap-4">
        {jobs.length === 0 && !loading && (
          <div className="text-center text-slate-400">No jobs found.</div>
        )}
        {jobs.map((job) => (
          <Card key={job.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
            <div className="flex-1">
              <div className="text-lg text-amber-100 font-serif font-light tracking-wide">{job.name}</div>
              <div className="text-sm text-slate-400 mb-1">{job.type} | {job.location}</div>
              <div className="text-sm text-slate-400 mb-1">Created: {new Date(job.creationDate).toLocaleDateString()}</div>
              {job.description && <div className="mt-2 text-sm text-slate-300">{job.description}</div>}
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(job)}
                className="gap-2 bg-slate-800/60 border-amber-200/20 text-amber-100 hover:bg-slate-800 hover:border-amber-200/40"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(job.id, job.name)}
                className="gap-2 bg-red-900/40 border border-red-400/40 text-red-200 hover:bg-red-900/60"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        totalResults={jobs.length}
        itemsPerPage={limit}
        onPageChange={setPage}
        disabled={loading}
      />

      <JobModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        job={selectedJob}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
        itemName={jobToDelete?.name}
      />
    </div>
  );
};

export default JobsPage;
