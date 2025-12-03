import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Call, NewCall, UpdateCall, CallDirection } from "@/types/call";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewCall | UpdateCall) => void;
  call?: Call;
  isLoading?: boolean;
}

export const CallModal = ({ isOpen, onClose, onSubmit, call, isLoading }: CallModalProps) => {
  const [formData, setFormData] = useState<NewCall | UpdateCall>({
    phoneNumber: call?.phoneNumber || "",
    direction: call?.direction || ("INBOUND" as CallDirection),
    discussionResume: call?.discussionResume || "",
    visiteDate: call?.visiteDate || "",
  });
  const [date, setDate] = useState<Date | undefined>(
    call?.visiteDate ? new Date(call.visiteDate) : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      visiteDate: date ? date.toISOString() : undefined,
    };
    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-amber-200/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-200">
            {call ? "Edit Call" : "Add New Call"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {call
              ? "Update call and visit information"
              : "Create a new call or visit record"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber" className="text-slate-300">
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+971 50 123 4567"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="direction" className="text-slate-300">
                Direction *
              </Label>
              <Select
                value={formData.direction}
                onValueChange={(value) => handleChange("direction", value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="INBOUND" className="text-white hover:bg-slate-700">
                    Inbound (Incoming)
                  </SelectItem>
                  <SelectItem value="OUTBOUND" className="text-white hover:bg-slate-700">
                    Outbound (Outgoing)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="visiteDate" className="text-slate-300">
                Visit Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal bg-slate-800 border-slate-700 text-white hover:bg-slate-700",
                      !date && "text-slate-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="bg-slate-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discussionResume" className="text-slate-300">
                Discussion Summary
              </Label>
              <Textarea
                id="discussionResume"
                placeholder="Enter discussion notes and summary..."
                value={formData.discussionResume}
                onChange={(e) => handleChange("discussionResume", e.target.value)}
                rows={4}
                className="bg-slate-800 border-slate-700 text-white resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isLoading ? "Saving..." : call ? "Update Call" : "Create Call"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
