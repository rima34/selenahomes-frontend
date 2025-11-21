import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Eye, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CreatePropertyModal from "@/components/CreatePropertyModal";
import ViewPropertyModal from "@/components/ViewPropertyModal";
import PaginationControls from "@/components/PaginationControls";
import { Property, PropertyStatus } from "@/types/property";
import { propertyService, PropertyFilter, PropertyOptions } from "@/services/propertyService";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const Properties = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProperty, setViewProperty] = useState<Property | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });

  const fetchProperties = useCallback(async (filters: PropertyFilter = {}, page: number = 1) => {
    try {
      setLoading(true);
      const response = await propertyService.getProperties(filters, {
        page,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc',
      });
      
      setProperties(response.results);
      setPagination({
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        totalResults: response.totalResults,
      });
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load properties when search term changes (always reset to page 1)
  useEffect(() => {
    const filters: PropertyFilter = {};
    if (searchTerm.trim()) {
      filters.name = searchTerm.trim();
    }
    
    fetchProperties(filters, 1);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchTerm, fetchProperties]);

  // Initial load on component mount
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Pagination will be reset to page 1 automatically in useEffect
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    
    // Fetch properties with the new page immediately
    const filters: PropertyFilter = {};
    if (searchTerm.trim()) {
      filters.name = searchTerm.trim();
    }
    
    fetchProperties(filters, newPage);
  };

  const handleCreateProperty = () => {
    setModalMode('create');
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setModalMode('edit');
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleViewProperty = (property: Property) => {
    setViewProperty(property);
    setIsViewModalOpen(true);
  };

  const handleAuthError = (error: Error) => {
    if (error.message.includes('Authentication required') || error.message.includes('Authentication failed')) {
      toast.error('Please log in to continue');
      logout();
      navigate('/auth');
      return true;
    }
    return false;
  };

  const handleSubmitProperty = async (propertyData: FormData, propertyId?: string) => {
    try {
      if (modalMode === 'edit' && propertyId) {
        await propertyService.updateProperty(propertyId, propertyData);
        toast.success('Property updated successfully');
      } else {
        await propertyService.createProperty(propertyData);
        if (modalMode === 'create') {
          toast.success('Property created successfully');
        } else {
          toast.success('Property updated successfully');
        }
      }
      setIsModalOpen(false);
      setSelectedProperty(null);
      
      // Refresh the list with current filters and pagination
      const filters: PropertyFilter = {};
      if (searchTerm.trim()) {
        filters.name = searchTerm.trim();
      }
      await fetchProperties(filters, pagination.page);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (!handleAuthError(error as Error)) {
        toast.error(errorMessage || `Failed to ${modalMode} property`);
      }
    }
  };

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    try {
      await propertyService.deleteProperty(propertyToDelete.id);
      toast.success('Property deleted successfully');
      
      // Refresh the list with current filters and pagination
      const filters: PropertyFilter = {};
      if (searchTerm.trim()) {
        filters.name = searchTerm.trim();
      }
      await fetchProperties(filters, pagination.page);
      
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (!handleAuthError(error as Error)) {
        toast.error(errorMessage || 'Failed to delete property');
      }
      
      // Close dialog even if there's an error
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const getStatusBadgeVariant = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.READY_TO_MOVE:
        return "default";
      case PropertyStatus.OFF_PLAN:
        return "secondary";
      case PropertyStatus.FOR_RENT:
        return "outline";
      default:
        return "default";
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



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-serif font-light tracking-[0.1em] bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent mb-2">Properties</h1>
          <p className="text-slate-300 font-light">
            Manage your property listings and inventory
          </p>
        </div>
        <Button onClick={handleCreateProperty} className="gap-2 bg-amber-200/10 backdrop-blur-sm border border-amber-200/30 text-amber-100 hover:bg-amber-200/20 hover:border-amber-200/50 transition-all duration-300 shadow-[0_2px_8px_rgba(251,191,36,0.15)]">
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      <Card className="bg-slate-900/60 backdrop-blur-xl border border-amber-200/20 shadow-[0_8px_32px_0_rgba(251,191,36,0.1)]">
        <CardHeader>
          <CardTitle className="text-2xl font-serif font-light tracking-wide text-amber-100">Property Listings</CardTitle>
          <CardDescription className="text-slate-400 font-light">
            A list of all properties in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>
          </div>

          {loading && properties.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-slate-300">
                <Loader2 className="h-6 w-6 animate-spin text-amber-200" />
                <span>Loading properties...</span>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-400 mb-4 font-light">
                {searchTerm ? 'No properties found matching your search.' : 'No properties found.'}
              </div>
              <Button onClick={handleCreateProperty} variant="outline" className="bg-slate-800/60 border-amber-200/20 text-amber-200 hover:bg-amber-200/10 hover:border-amber-200/40">
                <Plus className="w-4 h-4 mr-2" />
                Add your first property
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-amber-200/10 hover:bg-slate-800/40">
                    <TableHead key="name" className="text-amber-100 font-light">Name</TableHead>
                    <TableHead key="status" className="text-amber-100 font-light">Status</TableHead>
                    <TableHead key="price" className="text-amber-100 font-light">Price</TableHead>
                    <TableHead key="size" className="text-amber-100 font-light">Size Area</TableHead>
                    <TableHead key="handover" className="text-amber-100 font-light">Handover By</TableHead>
                    <TableHead key="created" className="text-amber-100 font-light">Created</TableHead>
                    <TableHead key="actions" className="text-right text-amber-100 font-light">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow className="border-amber-200/10">
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center text-slate-300">
                          <Loader2 className="h-6 w-6 animate-spin mr-2 text-amber-200" />
                          Loading properties...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    properties.map((property) => (
                    <TableRow key={property.id} className="border-amber-200/10 hover:bg-slate-800/40 transition-colors">
                      <TableCell>
                        <div>
                          <div key={`name-${property.id}`} className="font-medium text-slate-100">{property.name}</div>
                          {property.description && (
                            <div key={`desc-${property.id}`} className="text-sm text-slate-400 truncate max-w-xs">
                              {property.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(property.status)} className="bg-amber-200/20 text-amber-100 border-amber-200/30">
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-200">
                        {formatPrice(property.price)}
                      </TableCell>
                      <TableCell className="text-slate-300">{property.sizeArea || '-'}</TableCell>
                      <TableCell className="text-slate-300">{property.handoverBy || '-'}</TableCell>
                      <TableCell className="text-slate-300">{formatDate(property.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button 
                            key={`view-${property.id}`}
                            variant="ghost" 
                            size="sm"
                            className="text-slate-300 hover:text-amber-200 hover:bg-slate-800/60"
                            onClick={() => handleViewProperty(property)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            key={`edit-${property.id}`}
                            variant="ghost" 
                            size="sm"
                            className="text-slate-300 hover:text-amber-200 hover:bg-slate-800/60"
                            onClick={() => handleEditProperty(property)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            key={`delete-${property.id}`}
                            variant="ghost" 
                            size="sm"
                            className="text-slate-300 hover:text-red-400 hover:bg-slate-800/60"
                            onClick={() => handleDeleteClick(property)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalResults={pagination.totalResults}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </CardContent>
      </Card>

      <CreatePropertyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProperty(null);
        }}
        onSubmit={handleSubmitProperty}
        property={selectedProperty}
        mode={modalMode}
      />

      <ViewPropertyModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewProperty(null);
        }}
        property={viewProperty}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border border-amber-200/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-serif font-light text-amber-100">Delete Property</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300 font-light">
              Are you sure you want to delete "{propertyToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setPropertyToDelete(null);
              }}
              className="bg-slate-800/60 border-amber-200/20 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-900/60 text-red-100 hover:bg-red-900/80 border border-red-500/30"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Properties;