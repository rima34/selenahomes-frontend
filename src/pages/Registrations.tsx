import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerService } from "@/services/registerService";
import { Register, ProfileType, UpdateRegister, RegisterFilter, PropertyInfo } from "@/types/register";
import { Search, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { PaginationControls } from "@/components/PaginationControls";

const Registrations = () => {
  const [registers, setRegisters] = useState<Register[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProfileType, setFilterProfileType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedRegister, setSelectedRegister] = useState<Register | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [registerToDelete, setRegisterToDelete] = useState<Register | null>(null);

  const itemsPerPage = 10;

  const fetchRegisters = useCallback(async () => {
    setIsLoading(true);
    try {
      const filter: RegisterFilter = {};
      
      if (searchTerm) {
        filter.fullName = searchTerm;
      }
      
      if (filterProfileType && filterProfileType !== "all") {
        filter.profileType = filterProfileType as ProfileType;
      }

      const response = await registerService.getRegisters(filter, {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "createdAt",
        order: "desc",
      });
      setRegisters(response.results);
      setTotalPages(response.totalPages);
      setTotalResults(response.totalResults);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch registrations";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, filterProfileType]);

  useEffect(() => {
    fetchRegisters();
  }, [fetchRegisters]);

  const handleView = (register: Register) => {
    setSelectedRegister(register);
    setIsViewModalOpen(true);
  };

  const handleEdit = (register: Register) => {
    setSelectedRegister(register);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (register: Register) => {
    setRegisterToDelete(register);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!registerToDelete) return;

    try {
      await registerService.deleteRegister(registerToDelete.id);
      toast.success("Registration deleted successfully");
      fetchRegisters();
      setIsDeleteDialogOpen(false);
      setRegisterToDelete(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete registration";
      toast.error(message);
    }
  };

  const handleUpdateRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRegister) return;

    const formData = new FormData(e.currentTarget);
    const updateData: UpdateRegister = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      profileType: formData.get("profileType") as ProfileType,
    };

    try {
      await registerService.updateRegister(selectedRegister.id, updateData);
      toast.success("Registration updated successfully");
      setIsEditModalOpen(false);
      fetchRegisters();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update registration";
      toast.error(message);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRegisters();
  };

  const getProfileTypeBadgeColor = (profileType: ProfileType) => {
    switch (profileType) {
      case ProfileType.FIRST_TIME_BUYER:
        return "bg-blue-200/20 text-blue-100 border-blue-200/30";
      case ProfileType.BROKER_AGENT:
        return "bg-purple-200/20 text-purple-100 border-purple-200/30";
      case ProfileType.INVESTOR:
        return "bg-green-200/20 text-green-100 border-green-200/30";
      default:
        return "bg-amber-200/20 text-amber-100 border-amber-200/30";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPropertyInfo = (register: Register): PropertyInfo | null => {
    if (typeof register.propertyId === 'object' && register.propertyId !== null) {
      return register.propertyId as PropertyInfo;
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-serif font-light tracking-[0.1em] bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent mb-2">
            Registrations
          </h1>
          <p className="text-slate-300 font-light">
            Manage property registration inquiries
          </p>
        </div>
      </div>

      <Card className="bg-slate-900/60 backdrop-blur-xl border border-amber-200/20 shadow-[0_8px_32px_0_rgba(251,191,36,0.1)]">
        <CardHeader>
          <CardTitle className="text-2xl font-serif font-light tracking-wide text-amber-100">
            Registration Inquiries
          </CardTitle>
          <CardDescription className="text-slate-400 font-light">
            A list of all property registration requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Table */}
          {isLoading && registers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-slate-300">
                <Loader2 className="h-6 w-6 animate-spin text-amber-200" />
                <span>Loading registrations...</span>
              </div>
            </div>
          ) : registers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-400 mb-4 font-light">
                {searchTerm ? 'No registrations found matching your search.' : 'No registrations found.'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-amber-200/10 hover:bg-slate-800/40">
                    <TableHead className="text-amber-100 font-light">Full Name</TableHead>
                    <TableHead className="text-amber-100 font-light">Email</TableHead>
                    <TableHead className="text-amber-100 font-light">Phone</TableHead>
                    <TableHead className="text-amber-100 font-light">Profile Type</TableHead>
                    <TableHead className="text-amber-100 font-light">Property</TableHead>
                    <TableHead className="text-amber-100 font-light">Date</TableHead>
                    <TableHead className="text-right text-amber-100 font-light">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow className="border-amber-200/10">
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center text-slate-300">
                          <Loader2 className="h-6 w-6 animate-spin mr-2 text-amber-200" />
                          Loading registrations...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    registers.map((register) => {
                      const propertyInfo = getPropertyInfo(register);
                      return (
                        <TableRow key={register.id} className="border-amber-200/10 hover:bg-slate-800/40 transition-colors">
                          <TableCell className="font-medium text-slate-100">
                            {register.fullName}
                          </TableCell>
                          <TableCell className="text-slate-300">{register.email}</TableCell>
                          <TableCell className="text-slate-300">{register.phoneNumber}</TableCell>
                          <TableCell>
                            <Badge className={getProfileTypeBadgeColor(register.profileType)}>
                              {register.profileType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {propertyInfo ? (
                              <div>
                                <div className="font-medium text-slate-100 text-sm">
                                  {propertyInfo.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {formatPrice(propertyInfo.price)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {formatDate(register.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-300 hover:text-amber-200 hover:bg-slate-800/60"
                                onClick={() => handleView(register)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-300 hover:text-amber-200 hover:bg-slate-800/60"
                                onClick={() => handleEdit(register)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-300 hover:text-red-400 hover:bg-slate-800/60"
                                onClick={() => handleDeleteClick(register)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-amber-200/20 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-light tracking-wide text-amber-100">
              Registration Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              View registration inquiry information
            </DialogDescription>
          </DialogHeader>
          {selectedRegister && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-light text-amber-100 border-b border-amber-200/20 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400 text-xs">Full Name</Label>
                    <p className="font-medium text-slate-100">{selectedRegister.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs mx-2">Profile Type</Label>
                    <Badge className={getProfileTypeBadgeColor(selectedRegister.profileType)}>
                      {selectedRegister.profileType}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">Email</Label>
                    <p className="font-medium text-slate-100">{selectedRegister.email}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">Phone Number</Label>
                    <p className="font-medium text-slate-100">{selectedRegister.phoneNumber}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">Registration Date</Label>
                    <p className="font-medium text-slate-100">
                      {new Date(selectedRegister.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">Preferred Availability</Label>
                    <p className="font-medium text-slate-100">
                      {selectedRegister.availabilityTime
                        ? new Date(selectedRegister.availabilityTime).toLocaleString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              {(() => {
                const propertyInfo = getPropertyInfo(selectedRegister);
                return propertyInfo ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-light text-amber-100 border-b border-amber-200/20 pb-2">
                      Property Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-slate-400 text-xs">Property Name</Label>
                        <p className="font-medium text-slate-100">{propertyInfo.name}</p>
                      </div>
                      {propertyInfo.description && (
                        <div>
                          <Label className="text-slate-400 text-xs">Description</Label>
                          <p className="text-slate-300 text-sm">{propertyInfo.description}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-400 text-xs">Price</Label>
                          <p className="font-medium text-amber-100 text-lg">
                            {formatPrice(propertyInfo.price)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-slate-400 text-xs">Size Area</Label>
                          <p className="font-medium text-slate-100">{propertyInfo.sizeArea}</p>
                        </div>
                        <div>
                          <Label className="text-slate-400 text-xs">Status</Label>
                          <Badge className="bg-amber-200/20 text-amber-100 border-amber-200/30 mx-2">
                            {propertyInfo.status}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-slate-400 text-xs">Handover By</Label>
                          <p className="text-slate-300 text-sm">{propertyInfo.handoverBy}</p>
                        </div>
                      </div>
                      {propertyInfo.paymentPlan && (
                        <div>
                          <Label className="text-slate-400 text-xs">Payment Plan</Label>
                          <p className="text-slate-300 text-sm">{propertyInfo.paymentPlan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-400">
                    No property information available
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-amber-200/20 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-light tracking-wide text-amber-100">
              Edit Registration
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Update registration inquiry information
            </DialogDescription>
          </DialogHeader>
          {selectedRegister && (
            <form onSubmit={handleUpdateRegister} className="space-y-4">
              <div>
                <Label htmlFor="edit-fullName" className="text-slate-300">Full Name</Label>
                <Input
                  id="edit-fullName"
                  name="fullName"
                  defaultValue={selectedRegister.fullName}
                  required
                  className="bg-slate-800/60 border-amber-200/20 text-slate-100 focus:border-amber-200/40 focus:ring-amber-200/20"
                />
              </div>
              <div>
                <Label htmlFor="edit-email" className="text-slate-300">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  defaultValue={selectedRegister.email}
                  required
                  className="bg-slate-800/60 border-amber-200/20 text-slate-100 focus:border-amber-200/40 focus:ring-amber-200/20"
                />
              </div>
              <div>
                <Label htmlFor="edit-phoneNumber" className="text-slate-300">Phone Number</Label>
                <Input
                  id="edit-phoneNumber"
                  name="phoneNumber"
                  defaultValue={selectedRegister.phoneNumber}
                  required
                  className="bg-slate-800/60 border-amber-200/20 text-slate-100 focus:border-amber-200/40 focus:ring-amber-200/20"
                />
              </div>
              <div>
                <Label htmlFor="edit-profileType" className="text-slate-300">Profile Type</Label>
                <Select
                  name="profileType"
                  defaultValue={selectedRegister.profileType}
                >
                  <SelectTrigger id="edit-profileType" className="bg-slate-800/60 border-amber-200/20 text-slate-100 focus:border-amber-200/40 focus:ring-amber-200/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-amber-200/20">
                    <SelectItem value={ProfileType.FIRST_TIME_BUYER}>
                      First-Time Buyer
                    </SelectItem>
                    <SelectItem value={ProfileType.BROKER_AGENT}>
                      Broker/Agent
                    </SelectItem>
                    <SelectItem value={ProfileType.INVESTOR}>Investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-slate-800/60 border-amber-200/20 text-slate-300 hover:bg-slate-800 hover:text-amber-100"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-200/10 border border-amber-200/30 text-amber-100 hover:bg-amber-200/20">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Registration"
        description={`Are you sure you want to delete the registration from ${registerToDelete?.fullName}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Registrations;
