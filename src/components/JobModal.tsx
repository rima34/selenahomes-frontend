import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import * as jobService from "@/services/jobService";
import type { Job, JobPayload } from "@/services/jobService";

interface JobModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job?: Job | null;
}

const JobModal = ({ open, onClose, onSuccess, job }: JobModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JobPayload>({
    name: "",
    description: "",
    type: "full time",
    location: "",
  });

  const isEditMode = !!job;

  // Load job data when editing
  useEffect(() => {
    if (job) {
      setFormData({
        name: job.name,
        description: job.description || "",
        type: job.type,
        location: job.location,
      });
    } else {
      // Reset form when creating new job
      setFormData({
        name: "",
        description: "",
        type: "full time",
        location: "",
      });
    }
  }, [job, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as "full time" | "part time" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Job name is required");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && job) {
        await jobService.updateJob(job.id, formData);
        toast.success("Job updated successfully");
      } else {
        await jobService.createJob(formData);
        toast.success("Job created successfully");
      }
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error saving job";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900/95 backdrop-blur-xl border border-amber-200/20 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-light tracking-wide text-amber-100">
            {isEditMode ? "Edit Job" : "Create New Job"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-300">
                Job Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Sales manager"
                required
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type" className="text-slate-300">
                Job Type <span className="text-red-400">*</span>
              </Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="type" className="bg-slate-800/60 border-amber-200/20 text-slate-100 focus:border-amber-200/40 focus:ring-amber-200/20">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-amber-200/20">
                  <SelectItem value="full time" className="text-slate-100 focus:bg-amber-200/10 focus:text-amber-100">Full Time</SelectItem>
                  <SelectItem value="part time" className="text-slate-100 focus:bg-amber-200/10 focus:text-amber-100">Part Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location" className="text-slate-300">
                Location <span className="text-red-400">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
                required
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Job description..."
                rows={4}
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-amber-200/10 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="bg-slate-800/60 border-amber-200/20 text-slate-100 hover:bg-slate-800 hover:border-amber-200/40"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-amber-200/20 border border-amber-200/40 text-amber-100 hover:bg-amber-200/30 font-serif font-light tracking-wide"
            >
              {loading ? "Saving..." : isEditMode ? "Update Job" : "Create Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobModal;
