import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as applicationService from "@/services/applicationService";
import type { Job } from "@/services/jobService";
import { Loader2, Upload, X } from "lucide-react";

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job?: Job | null;
}

interface ApplicationFormData {
  fullName: string;
  emailAddress: string;
  yearsOfExperience: number | string;
  linkedinLink: string;
  coverLetterText: string;
  cvFile: File | null;
}

const ApplicationModal = ({ open, onClose, onSuccess, job }: ApplicationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    emailAddress: "",
    yearsOfExperience: "",
    linkedinLink: "",
    coverLetterText: "",
    cvFile: null,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        fullName: "",
        emailAddress: "",
        yearsOfExperience: "",
        linkedinLink: "",
        coverLetterText: "",
        cvFile: null,
      });
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed for CV upload");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("CV file size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, cvFile: file }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, cvFile: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job) {
      toast.error("No job selected");
      return;
    }

    // Validation
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.emailAddress.trim()) {
      toast.error("Email address is required");
      return;
    }
    if (!formData.yearsOfExperience || Number(formData.yearsOfExperience) < 0) {
      toast.error("Years of experience is required and must be 0 or greater");
      return;
    }
    if (!formData.cvFile) {
      toast.error("CV upload is required");
      return;
    }

    // Validate LinkedIn URL if provided
    if (formData.linkedinLink && !formData.linkedinLink.match(/^https?:\/\/(www\.)?linkedin\.com\//)) {
      toast.error("Please provide a valid LinkedIn URL");
      return;
    }

    setLoading(true);
    try {
      const payload: applicationService.ApplicationPayload = {
        fullName: formData.fullName.trim(),
        emailAddress: formData.emailAddress.trim().toLowerCase(),
        jobId: job.id,
        yearsOfExperience: Number(formData.yearsOfExperience),
        linkedinLink: formData.linkedinLink.trim() || undefined,
        coverLetterText: formData.coverLetterText.trim() || undefined,
      };

      await applicationService.createApplication(payload, formData.cvFile);
      toast.success("Application submitted successfully! We'll get back to you soon.");
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error submitting application";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-amber-200/20 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-light tracking-wide text-amber-100">
            Apply for {job.name}
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-light">
            Fill out the form below to submit your application. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="fullName" className="text-slate-300">
                Full Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>

            {/* Email Address */}
            <div className="grid gap-2">
              <Label htmlFor="emailAddress" className="text-slate-300">
                Email Address <span className="text-red-400">*</span>
              </Label>
              <Input
                id="emailAddress"
                name="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>

            {/* Years of Experience */}
            <div className="grid gap-2">
              <Label htmlFor="yearsOfExperience" className="text-slate-300">
                Years of Experience <span className="text-red-400">*</span>
              </Label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="5"
                required
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>

            {/* LinkedIn Link */}
            <div className="grid gap-2">
              <Label htmlFor="linkedinLink" className="text-slate-300">
                LinkedIn Profile URL
              </Label>
              <Input
                id="linkedinLink"
                name="linkedinLink"
                type="url"
                value={formData.linkedinLink}
                onChange={handleChange}
                placeholder="https://www.linkedin.com/in/johndoe"
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>

            {/* Cover Letter */}
            <div className="grid gap-2">
              <Label htmlFor="coverLetterText" className="text-slate-300">
                Cover Letter
              </Label>
              <Textarea
                id="coverLetterText"
                name="coverLetterText"
                value={formData.coverLetterText}
                onChange={handleChange}
                placeholder="Tell us why you're a great fit for this position..."
                rows={5}
                maxLength={2000}
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
              <p className="text-xs text-slate-500">
                {formData.coverLetterText.length}/2000 characters
              </p>
            </div>

            {/* CV Upload */}
            <div className="grid gap-2">
              <Label htmlFor="cvFile" className="text-slate-300">
                Upload CV (PDF) <span className="text-red-400">*</span>
              </Label>
              {!formData.cvFile ? (
                <div className="relative">
                  <Input
                    id="cvFile"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="cvFile"
                    className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-amber-200/20 rounded-lg cursor-pointer hover:border-amber-200/40 transition-colors bg-slate-800/40"
                  >
                    <Upload className="w-5 h-5 text-amber-200" />
                    <span className="text-sm text-slate-300">
                      Click to upload your CV (PDF, max 5MB)
                    </span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-slate-800/60 border border-amber-200/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-200/10 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-100">{formData.cvFile.name}</p>
                      <p className="text-xs text-slate-400">
                        {(formData.cvFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
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
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
