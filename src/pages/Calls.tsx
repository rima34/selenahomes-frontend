import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, Calendar, Plus, Search, Edit, Trash2, MessageSquare, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fetchCalls, createCall, updateCall, deleteCall } from "@/services/callService";
import { CallModal } from "@/components/CallModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { PaginationControls } from "@/components/PaginationControls";
import type { Call, CallDirection, CallFilter, NewCall, UpdateCall } from "@/types/call";

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | undefined>();
  const [callToDelete, setCallToDelete] = useState<Call | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const limit = 10;

  // Filters
  const [searchPhone, setSearchPhone] = useState("");
  const [filterDirection, setFilterDirection] = useState<string>("all");

  // Helper function to safely format dates
  const formatDate = (dateString: string | undefined, formatStr: string = "PPp"): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return format(date, formatStr);
    } catch {
      return "N/A";
    }
  };

  useEffect(() => {
    loadCalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchPhone, filterDirection]);

  const loadCalls = async () => {
    try {
      setLoading(true);
      const filter: CallFilter = {};
      
      if (searchPhone) {
        filter.phoneNumber = searchPhone;
      }
      
      if (filterDirection && filterDirection !== "all") {
        filter.direction = filterDirection as CallDirection;
      }

      const response = await fetchCalls(filter, {
        page: currentPage,
        limit,
        sortBy: "createdAt",
        order: "desc",
      });

      setCalls(response.results);
      setTotalPages(response.totalPages);
      setTotalResults(response.totalResults);
    } catch (error) {
      toast.error("Failed to load calls");
      console.error("Error loading calls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCall = async (data: NewCall) => {
    try {
      setIsSubmitting(true);
      await createCall(data);
      toast.success("Call created successfully");
      setIsModalOpen(false);
      loadCalls();
    } catch (error) {
      toast.error("Failed to create call");
      console.error("Error creating call:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCall = async (data: UpdateCall) => {
    if (!selectedCall) return;

    try {
      setIsSubmitting(true);
      await updateCall(selectedCall.id, data);
      toast.success("Call updated successfully");
      setIsModalOpen(false);
      setSelectedCall(undefined);
      loadCalls();
    } catch (error) {
      toast.error("Failed to update call");
      console.error("Error updating call:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCall = async () => {
    if (!callToDelete) return;

    try {
      await deleteCall(callToDelete.id);
      toast.success("Call deleted successfully");
      setIsDeleteDialogOpen(false);
      setCallToDelete(undefined);
      loadCalls();
    } catch (error) {
      toast.error("Failed to delete call");
      console.error("Error deleting call:", error);
    }
  };

  const openCreateModal = () => {
    setSelectedCall(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (call: Call) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (call: Call) => {
    setCallToDelete(call);
    setIsDeleteDialogOpen(true);
  };

  const getDirectionIcon = (direction: CallDirection) => {
    return direction === "INBOUND" ? (
      <PhoneIncoming className="w-4 h-4" />
    ) : (
      <PhoneOutgoing className="w-4 h-4" />
    );
  };

  const getDirectionBadge = (direction: CallDirection) => {
    return direction === "INBOUND" ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
        <PhoneIncoming className="w-3 h-3 mr-1" />
        Inbound
      </Badge>
    ) : (
      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
        <PhoneOutgoing className="w-3 h-3 mr-1" />
        Outbound
      </Badge>
    );
  };

  if (loading && calls.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-200 border-r-transparent"></div>
            <p className="mt-4 text-slate-300">Loading calls...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-serif font-light tracking-wide text-amber-200 mb-2">
              Call & Visit Management
            </h1>
            <p className="text-slate-400">
              Track and manage all customer calls and visit schedules
            </p>
          </div>
          <Button
            onClick={openCreateModal}
            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Plus className="w-4 h-4" />
            Add Call
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by phone number..."
                  value={searchPhone}
                  onChange={(e) => {
                    setSearchPhone(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <Select
                value={filterDirection}
                onValueChange={(value) => {
                  setFilterDirection(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Directions" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">
                    All Directions
                  </SelectItem>
                  <SelectItem value="INBOUND" className="text-white hover:bg-slate-700">
                    Inbound Only
                  </SelectItem>
                  <SelectItem value="OUTBOUND" className="text-white hover:bg-slate-700">
                    Outbound Only
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <PhoneCall className="w-4 h-4" />
                <span>Total: {totalResults} calls</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calls List */}
      <div className="grid gap-4">
        {calls.length === 0 ? (
          <Card className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Phone className="w-16 h-16 text-slate-600 mb-4" />
              <p className="text-slate-400 text-center">
                No calls found. Start by adding your first call record.
              </p>
              <Button
                onClick={openCreateModal}
                className="mt-4 bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Call
              </Button>
            </CardContent>
          </Card>
        ) : (
          calls.map((call) => (
            <Card
              key={call.id}
              className="bg-slate-900/60 backdrop-blur-sm border-amber-200/20 hover:border-amber-200/40 transition-all"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-amber-500/20">
                        <Phone className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">
                          {call.phoneNumber}
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-sm">
                          {formatDate(call.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getDirectionBadge(call.direction)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(call)}
                      className="text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(call)}
                      className="text-slate-400 hover:text-red-400 hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {call.visiteDate && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Visit scheduled for:</span>
                    <span className="font-medium text-amber-200">
                      {formatDate(call.visiteDate, "PPP")}
                    </span>
                  </div>
                )}

                {call.discussionResume && (
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 mb-1">Discussion Summary:</p>
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">
                          {call.discussionResume}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            itemsPerPage={limit}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modals */}
      <CallModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCall(undefined);
        }}
        onSubmit={selectedCall ? handleUpdateCall : handleCreateCall}
        call={selectedCall}
        isLoading={isSubmitting}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setCallToDelete(undefined);
        }}
        onConfirm={handleDeleteCall}
        title="Delete Call"
        description={`Are you sure you want to delete this call record for ${callToDelete?.phoneNumber}? This action cannot be undone.`}
      />
    </div>
  );
}
