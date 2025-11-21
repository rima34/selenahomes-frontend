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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { propertyTypeService } from '@/services/propertyTypeService';
import type { PropertyType, CreatePropertyTypeRequest, UpdatePropertyTypeRequest, Category } from '@/types/property-type';
import { useToast } from '@/hooks/use-toast';

interface PropertyTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propertyType?: PropertyType | null;
  mode: 'create' | 'edit';
}

export const PropertyTypeModal: React.FC<PropertyTypeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  propertyType,
  mode,
}) => {
  const [formData, setFormData] = useState<CreatePropertyTypeRequest>({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && propertyType) {
      setFormData({
        name: propertyType.name,
        description: propertyType.description || '',
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [mode, propertyType, isOpen]);

  const handleInputChange = (field: keyof CreatePropertyTypeRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Property type name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (mode === 'create') {
        // Only send non-empty fields for create
        const createData: CreatePropertyTypeRequest = {
          name: formData.name.trim(),
        };
        
        // Only add description if it's not empty
        if (formData.description && formData.description.trim()) {
          createData.description = formData.description.trim();
        }
        
        await propertyTypeService.createPropertyType(createData);
        toast({
          title: 'Success',
          description: 'Property type created successfully',
        });
      } else if (mode === 'edit' && propertyType) {
        // Only send fields that have changed
        const updateData: UpdatePropertyTypeRequest = {};
        
        if (formData.name.trim() !== propertyType.name) {
          updateData.name = formData.name.trim();
        }
        
        // Only update description if it has changed
        const newDescription = formData.description?.trim() || '';
        const oldDescription = propertyType.description || '';
        if (newDescription !== oldDescription) {
          if (newDescription) {
            updateData.description = newDescription;
          }
          // If description was cleared, send empty string to update
          else if (oldDescription) {
            updateData.description = '';
          }
        }
        
        await propertyTypeService.updatePropertyType(propertyType.id, updateData);
        toast({
          title: 'Success',
          description: 'Property type updated successfully',
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save property type',
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
      <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-xl border border-amber-200/20 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-light tracking-wide text-amber-100">
            {mode === 'create' ? 'Create Property Type' : 'Edit Property Type'}
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-light">
            {mode === 'create' 
              ? 'Add a new property type to your system.'
              : 'Update the property type information.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter property type name"
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
              placeholder="Enter property type description (optional)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
              rows={3}
              className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
            />
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