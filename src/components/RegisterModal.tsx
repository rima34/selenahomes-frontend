import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { registerService } from "@/services/registerService";
import { ProfileType } from "@/types/register";
import { Loader2 } from "lucide-react";
import countryCodes from "@/types/CountryCodes.json";

interface CountryCode {
  name: string;
  dial_code: string;
  code: string;
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName?: string;
  propertyId?: string;
}

const RegisterModal = ({ isOpen, onClose, propertyName, propertyId }: RegisterModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phonePrefix: "+971",
    phoneNumber: "",
    profileType: "" as ProfileType | "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.profileType) {
      toast.error("Please select a profile type");
      return;
    }

    setIsLoading(true);
    try {
      // Combine prefix and number, ensuring no extra spaces
      const fullPhoneNumber = `${formData.phonePrefix}${formData.phoneNumber}`;
      
      await registerService.createRegister({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: fullPhoneNumber,
        profileType: formData.profileType as ProfileType,
        ...(propertyId && { propertyId }), // Only include if propertyId exists
      });

      toast.success("Registration submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        phonePrefix: "+971",
        phoneNumber: "",
        profileType: "",
      });
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit registration";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-amber-200/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-light tracking-wide bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent">
            Register Your Interest
          </DialogTitle>
          {propertyName && (
            <p className="text-sm text-slate-400 mt-2">
              For: <span className="text-amber-200">{propertyName}</span>
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-300">
              Full Name *
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="bg-slate-800/50 border-amber-200/20 focus:border-amber-200/50 text-white"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="bg-slate-800/50 border-amber-200/20 focus:border-amber-200/50 text-white"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-slate-300">
              Phone Number *
            </Label>
            <div className="flex gap-2">
              <Select
                value={formData.phonePrefix}
                onValueChange={(value) => handleChange("phonePrefix", value)}
              >
                <SelectTrigger className="w-[180px] bg-slate-800/50 border-amber-200/20 focus:border-amber-200/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-amber-200/30 max-h-[300px]">
                  {(countryCodes as CountryCode[])
                    .sort((a, b) => {
                      // Put UAE first
                      if (a.code === "AE") return -1;
                      if (b.code === "AE") return 1;
                      // Then sort alphabetically by name
                      return a.name.localeCompare(b.name);
                    })
                    .map((country) => (
                      <SelectItem
                        key={country.code}
                        value={country.dial_code}
                        className="text-white hover:bg-slate-800"
                      >
                        {country.dial_code} ({country.name})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => {
                  // Remove any non-digit characters except spaces
                  const cleaned = e.target.value.replace(/[^\d\s]/g, '');
                  handleChange("phoneNumber", cleaned);
                }}
                required
                minLength={7}
                maxLength={15}
                className="flex-1 bg-slate-800/50 border-amber-200/20 focus:border-amber-200/50 text-white"
                placeholder="50 123 4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileType" className="text-slate-300">
              Profile Type *
            </Label>
            <Select
              value={formData.profileType}
              onValueChange={(value) => handleChange("profileType", value)}
              required
            >
              <SelectTrigger className="bg-slate-800/50 border-amber-200/20 focus:border-amber-200/50 text-white">
                <SelectValue placeholder="Select your profile type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-amber-200/30">
                <SelectItem value={ProfileType.FIRST_TIME_BUYER} className="text-white hover:bg-slate-800">
                  First-Time Buyer
                </SelectItem>
                <SelectItem value={ProfileType.BROKER_AGENT} className="text-white hover:bg-slate-800">
                  Broker/Agent
                </SelectItem>
                <SelectItem value={ProfileType.INVESTOR} className="text-white hover:bg-slate-800">
                  Investor
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-amber-200/30 text-amber-200 hover:bg-slate-800/50"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-200 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-slate-900 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
