import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { propertyTypeService } from '@/services/propertyTypeService';
import type { 
  Category, 
  CreateCategoryRequest, 
  UpdateCategoryRequest, 
  PropertyType 
} from '@/types/property-type';
import { useToast } from '@/hooks/use-toast';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null;
  mode: 'create' | 'edit';
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
  mode,
}) => {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
    propertyTypes: [],
  });
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPropertyTypes, setIsLoadingPropertyTypes] = useState(false);
  const { toast } = useToast();

  const loadPropertyTypes = useCallback(async () => {
    try {
      setIsLoadingPropertyTypes(true);
      const response = await propertyTypeService.getPropertyTypes({}, { limit: 100 });
      setPropertyTypes(response.results);
    } catch (error) {
      console.error('Failed to load property types:', error);
      toast({
        title: 'Error',
        description: 'Failed to load property types',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPropertyTypes(false);
    }
  }, [toast]);

  // Load property types on component mount
  useEffect(() => {
    if (isOpen) {
      loadPropertyTypes();
    }
  }, [isOpen, loadPropertyTypes]);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        propertyTypes: Array.isArray(category.propertyTypes) 
          ? category.propertyTypes.map(pt => typeof pt === 'string' ? pt : pt.id)
          : [],
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        propertyTypes: [],
      });
    }
  }, [mode, category, isOpen]);

  const handleInputChange = (field: keyof CreateCategoryRequest, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePropertyTypeToggle = (propertyTypeId: string, checked: boolean) => {
    setFormData(prev => {
      const currentTypes = prev.propertyTypes || [];
      if (checked) {
        return {
          ...prev,
          propertyTypes: [...currentTypes, propertyTypeId],
        };
      } else {
        return {
          ...prev,
          propertyTypes: currentTypes.filter(id => id !== propertyTypeId),
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (mode === 'create') {
        // Only send non-empty fields for create
        const createData: CreateCategoryRequest = {
          name: formData.name.trim(),
        };
        
        // Only add description if it's not empty
        if (formData.description && formData.description.trim()) {
          createData.description = formData.description.trim();
        }
        
        // Only add propertyTypes if there are selected types
        if (formData.propertyTypes && formData.propertyTypes.length > 0) {
          createData.propertyTypes = formData.propertyTypes;
        }
        
        await propertyTypeService.createCategory(createData);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      } else if (mode === 'edit' && category) {
        // Only send fields that have changed and are not empty
        const updateData: UpdateCategoryRequest = {};
        
        if (formData.name.trim() !== category.name) {
          updateData.name = formData.name.trim();
        }
        
        // Only update description if it has changed and is not empty
        const newDescription = formData.description?.trim() || '';
        const oldDescription = category.description || '';
        if (newDescription !== oldDescription) {
          if (newDescription) {
            updateData.description = newDescription;
          }
          // If description was cleared, we still send it (as empty string) to update
          else if (oldDescription) {
            updateData.description = '';
          }
        }
        
        // Always update property types if they have changed
        const oldPropertyTypeIds = Array.isArray(category.propertyTypes) 
          ? category.propertyTypes.map(pt => typeof pt === 'string' ? pt : pt.id)
          : [];
        const newPropertyTypeIds = formData.propertyTypes || [];
        
        const typesChanged = oldPropertyTypeIds.length !== newPropertyTypeIds.length ||
          oldPropertyTypeIds.some(id => !newPropertyTypeIds.includes(id)) ||
          newPropertyTypeIds.some(id => !oldPropertyTypeIds.includes(id));
        
        if (typesChanged) {
          updateData.propertyTypes = newPropertyTypeIds;
        }
        
        await propertyTypeService.updateCategory(category.id, updateData);
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save category:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save category',
        variant: 'destructive',
      });
      // Keep form values on error - don't reset or close
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-amber-200/20 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-light tracking-wide text-amber-100">
            {mode === 'create' ? 'Create Category' : 'Edit Category'}
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-light">
            {mode === 'create' 
              ? 'Add a new category and assign property types to it.'
              : 'Update the category information and property type assignments.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
              required
              className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter category description (optional)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
              rows={3}
              className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Property Types</Label>
            {isLoadingPropertyTypes ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-amber-200" />
                <span className="text-sm text-slate-400">Loading property types...</span>
              </div>
            ) : propertyTypes.length > 0 ? (
              <div className="border border-amber-200/20 rounded-md p-3 max-h-48 overflow-y-auto bg-slate-800/40">
                <div className="grid grid-cols-1 gap-2">
                  {propertyTypes.map((propertyType) => (
                    <div key={propertyType.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`property-type-${propertyType.id}`}
                        checked={formData.propertyTypes?.includes(propertyType.id) || false}
                        onCheckedChange={(checked) => 
                          handlePropertyTypeToggle(propertyType.id, checked as boolean)
                        }
                        disabled={isLoading}
                        className="border-amber-200/40 data-[state=checked]:bg-amber-200/20 data-[state=checked]:border-amber-200"
                      />
                      <Label 
                        htmlFor={`property-type-${propertyType.id}`}
                        className="text-sm font-normal cursor-pointer text-slate-200"
                      >
                        {propertyType.name}
                        {propertyType.description && (
                          <span className="text-slate-400 block text-xs">
                            {propertyType.description}
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No property types available</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-amber-200/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="bg-slate-800/60 border-amber-200/20 text-slate-100 hover:bg-slate-800 hover:border-amber-200/40"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-amber-200/20 border border-amber-200/40 text-amber-100 hover:bg-amber-200/30 font-serif font-light tracking-wide"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};