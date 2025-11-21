import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Loader2, Tags } from 'lucide-react';
import { PropertyTypeModal } from '@/components/PropertyTypeModal';
import { CategoryModal } from '@/components/CategoryModal';
import PaginationControls from '@/components/PaginationControls';
import { propertyTypeService } from '@/services/propertyTypeService';
import type { Category, PropertyType, PropertyTypeFilter, PropertyTypeOptions, CategoryPaginatedResponse } from '@/types/property-type';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PropertyTypes() {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyTypeToDelete, setPropertyTypeToDelete] = useState<PropertyType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });
  const { toast } = useToast();
  
  // Category state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
  const [categoryDeleteDialogOpen, setCategoryDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [categoryPagination, setCategoryPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });
  
    const loadCategories = useCallback(async () => {
      try {
        setIsLoadingCategories(true);
        const categoriesResponse = await propertyTypeService.getCategories({}, {
          page: categoryPagination.page,
          limit: categoryPagination.limit,
          sortBy: 'createdAt',
          order: 'desc',
        });
        setCategories(categoriesResponse.results);
        setCategoryPagination({
          page: categoriesResponse.page,
          limit: categoriesResponse.limit,
          totalPages: categoriesResponse.totalPages,
          totalResults: categoriesResponse.totalResults,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingCategories(false);
      }
    }, [categoryPagination.page, categoryPagination.limit, toast]);
  

  const loadPropertyTypes = useCallback(async (filters: PropertyTypeFilter = {}, options: PropertyTypeOptions = {}) => {
    try {
      setIsLoading(true);
      const response = await propertyTypeService.getPropertyTypes(filters, {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        order: 'desc',
        ...options,
      });
      setPropertyTypes(response.results);
      setPagination({
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        totalResults: response.totalResults,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load property types',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, toast]);

  // Load property types on component mount and when dependencies change
  useEffect(() => {
    const filters: PropertyTypeFilter = {};
    if (searchTerm.trim()) {
      filters.name = searchTerm.trim();
    }
    
    loadPropertyTypes(filters);
  }, [searchTerm, pagination.page, loadPropertyTypes]);

  // Load categories on component mount and when pagination changes
  useEffect(() => {
    loadCategories();
  }, [categoryPagination.page, loadCategories]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
  };

  const handleCreateClick = () => {
    setSelectedPropertyType(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditClick = (propertyType: PropertyType) => {
    setSelectedPropertyType(propertyType);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (propertyType: PropertyType) => {
    setPropertyTypeToDelete(propertyType);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyTypeToDelete) return;

    try {
      setIsDeleting(true);
      await propertyTypeService.deletePropertyType(propertyTypeToDelete.id);
      toast({
        title: 'Success',
        description: 'Property type deleted successfully',
      });
      await loadPropertyTypes(); // Reload the list
      setDeleteDialogOpen(false);
      setPropertyTypeToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete property type',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSuccess = async () => {
    await loadPropertyTypes(); // Reload the list after successful create/update
  };

  // Category management functions
  const handleCreateCategoryClick = () => {
    setSelectedCategory(null);
    setCategoryModalMode('create');
    setIsCategoryModalOpen(true);
  };

  const handleEditCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setCategoryModalMode('edit');
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategoryClick = (category: Category) => {
    setCategoryToDelete(category);
    setCategoryDeleteDialogOpen(true);
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeletingCategory(true);
      await propertyTypeService.deleteCategory(categoryToDelete.id);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      await loadCategories(); // Reload the list
      setCategoryDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete category',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const handleCategoryModalSuccess = async () => {
    await loadCategories(); // Reload the categories list after successful create/update
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleCategoryPageChange = (newPage: number) => {
    setCategoryPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && propertyTypes.length === 0) {
    return <LoadingSpinner />;
  }
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-light tracking-wide bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent">
            Property Types & Categories
          </h1>
          <p className="text-slate-400 font-light">
            Manage property types and categories for your real estate listings
          </p>
        </div>
        <Button 
          onClick={handleCreateClick}
          className="bg-amber-200/20 border border-amber-200/40 text-amber-100 hover:bg-amber-200/30 font-serif font-light tracking-wide"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Property Type
        </Button>
      </div>

      <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
        <CardHeader>
          <CardTitle className="font-serif font-light tracking-wide text-amber-100">Property Types Management</CardTitle>
          <CardDescription className="text-slate-400 font-light">
            View, create, edit, and delete property types
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search property types..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>
          </div>

          {/* Table */}
          <div className="border border-amber-200/10 rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-amber-200/10 hover:bg-slate-800/40">
                  <TableHead className="text-amber-200/80">Name</TableHead>
                  <TableHead className="text-amber-200/80">Description</TableHead>
                  <TableHead className="text-amber-200/80">Created At</TableHead>
                  <TableHead className="text-amber-200/80">Updated At</TableHead>
                  <TableHead className="text-right text-amber-200/80">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="border-b border-amber-200/10">
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center text-slate-300">
                        <Loader2 className="h-6 w-6 animate-spin mr-2 text-amber-200" />
                        Loading property types...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : propertyTypes.length === 0 ? (
                  <TableRow className="border-b border-amber-200/10">
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-slate-400">
                        {searchTerm ? 'No property types found matching your search.' : 'No property types found.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  propertyTypes.map((propertyType) => (
                    <TableRow key={propertyType.id} className="border-b border-amber-200/10 hover:bg-slate-800/40">
                      <TableCell className="font-medium">
                        <Badge variant="secondary" className="bg-amber-200/10 text-amber-100 border-amber-200/20">
                          {propertyType.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {propertyType.description || (
                          <span className="text-slate-500 italic">No description</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-300">{formatDate(propertyType.createdAt)}</TableCell>
                      <TableCell className="text-slate-300">{formatDate(propertyType.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            key={`edit-${propertyType.id}`}
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(propertyType)}
                            className="bg-slate-800/60 border-amber-200/20 text-amber-100 hover:bg-slate-800 hover:border-amber-200/40"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            key={`delete-${propertyType.id}`}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(propertyType)}
                            className="bg-red-900/20 border-red-400/20 text-red-300 hover:bg-red-900/40 hover:border-red-400/40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalResults={pagination.totalResults}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      {/* Categories Section */}
      <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2 font-serif font-light tracking-wide text-amber-100">
                <Tags className="h-5 w-5" />
                Categories
              </CardTitle>
              <CardDescription className="text-slate-400 font-light">
                Manage categories and assign property types to them
              </CardDescription>
            </div>
            <Button 
              onClick={handleCreateCategoryClick} 
              variant="outline"
              className="bg-slate-800/60 border-amber-200/20 text-amber-100 hover:bg-slate-800 hover:border-amber-200/40"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingCategories ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-slate-300">
                <Loader2 className="h-6 w-6 animate-spin text-amber-200" />
                <span>Loading categories...</span>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-400 mb-4">No categories found</div>
              <Button 
                onClick={handleCreateCategoryClick} 
                variant="outline"
                className="bg-slate-800/60 border-amber-200/20 text-amber-100 hover:bg-slate-800 hover:border-amber-200/40"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create your first category
              </Button>
            </div>
          ) : (
            <div className="border border-amber-200/10 rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-amber-200/10 hover:bg-slate-800/40">
                    <TableHead className="text-amber-200/80">Name</TableHead>
                    <TableHead className="text-amber-200/80">Description</TableHead>
                    <TableHead className="text-amber-200/80">Property Types</TableHead>
                    <TableHead className="text-amber-200/80">Created At</TableHead>
                    <TableHead className="text-right text-amber-200/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className="border-b border-amber-200/10 hover:bg-slate-800/40">
                      <TableCell className="font-medium">
                        <Badge variant="secondary" className="bg-amber-200/10 text-amber-100 border-amber-200/20">
                          {category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {category.description || (
                          <span className="text-slate-500 italic">No description</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {category.propertyTypes && category.propertyTypes.length > 0 ? (
                            category.propertyTypes.map((pt, index) => (
                              <Badge
                                key={typeof pt === 'string' ? pt : pt.id}
                                variant="outline"
                                className="text-xs bg-amber-200/10 text-amber-100 border-amber-200/20"
                              >
                                {typeof pt === 'string' ? `Type ${index + 1}` : pt.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-slate-500 text-sm">No property types</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{formatDate(category.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            key={`edit-category-${category.id}`}
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCategoryClick(category)}
                            className="bg-slate-800/60 border-amber-200/20 text-amber-100 hover:bg-slate-800 hover:border-amber-200/40"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            key={`delete-category-${category.id}`}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategoryClick(category)}
                            className="bg-red-900/20 border-red-400/20 text-red-300 hover:bg-red-900/40 hover:border-red-400/40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Category Pagination */}
          <PaginationControls
            currentPage={categoryPagination.page}
            totalPages={categoryPagination.totalPages}
            totalResults={categoryPagination.totalResults}
            itemsPerPage={categoryPagination.limit}
            onPageChange={handleCategoryPageChange}
            disabled={isLoadingCategories}
          />
        </CardContent>
      </Card>

      {/* Property Type Modal */}
      <PropertyTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        propertyType={selectedPropertyType}
        mode={modalMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border border-amber-200/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-amber-100 font-serif font-light tracking-wide">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              This action cannot be undone. This will permanently delete the property type
              "{propertyTypeToDelete?.name}" from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeleting}
              className="bg-slate-800/60 border-amber-200/20 text-slate-100 hover:bg-slate-800 hover:border-amber-200/40"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-900/40 border border-red-400/40 text-red-200 hover:bg-red-900/60"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={handleCategoryModalSuccess}
        category={selectedCategory}
        mode={categoryModalMode}
      />

      {/* Category Delete Confirmation Dialog */}
      <AlertDialog open={categoryDeleteDialogOpen} onOpenChange={setCategoryDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border border-amber-200/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-amber-100 font-serif font-light tracking-wide">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              This action cannot be undone. This will permanently delete the category
              "{categoryToDelete?.name}" from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeletingCategory}
              className="bg-slate-800/60 border-amber-200/20 text-slate-100 hover:bg-slate-800 hover:border-amber-200/40"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategoryConfirm}
              disabled={isDeletingCategory}
              className="bg-red-900/40 border border-red-400/40 text-red-200 hover:bg-red-900/60"
            >
              {isDeletingCategory && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}