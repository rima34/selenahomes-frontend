import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Property, PropertyStatus } from "@/types/property";
import { PropertyType, Category } from "@/types/property-type";
import { propertyTypeService } from "@/services/propertyTypeService";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData, propertyId?: string) => Promise<void>;
  property?: Property | null;
  mode?: 'create' | 'edit';
}

interface PropertyFormData {
  name: string;
  description: string;
  category: string;
  propertyTypes: string[];
  status: PropertyStatus | '';
  price: string;
  priceFrom: string;
  priceTo: string;
  size: string;
  sizeFrom: string;
  sizeTo: string;
  sizeArea: string;
  beds: string;
  baths: string;
  locationIframe: string;
  handoverBy: string;
  paymentPlan: string;
  completionDate: Date | undefined;
  images: FileList | null;
  replaceImages: boolean;
}

const CreatePropertyModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  property = null, 
  mode = 'create' 
}: CreatePropertyModalProps) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    description: '',
    category: '',
    propertyTypes: [],
    status: '',
    price: '',
    priceFrom: '',
    priceTo: '',
    size: '',
    sizeFrom: '',
    sizeTo: '',
    sizeArea: '',
    beds: '',
    baths: '',
    locationIframe: '',
    handoverBy: '',
    paymentPlan: '',
    completionDate: undefined,
    images: null,
    replaceImages: true,
  });
  const [loading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [propertyTypesList, setPropertyTypesList] = useState<PropertyType[]>([]);
  const [filteredPropertyTypes, setFilteredPropertyTypes] = useState<PropertyType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(false);
  const [isPropertyTypesOpen, setIsPropertyTypesOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;

      setLoadingCategories(true);
      try {
        const categoriesResponse = await propertyTypeService.getCategories({}, { limit: 100 });
        setCategoriesList(categoriesResponse.results);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      } finally {
        setLoadingCategories(false);
      }

      setLoadingPropertyTypes(true);
      try {
        const response = await propertyTypeService.getPropertyTypes({}, { limit: 100 });
        setPropertyTypesList(response.results);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load property types',
          variant: 'destructive',
        });
      } finally {
        setLoadingPropertyTypes(false);
      }
    };

    fetchData();
  }, [isOpen, toast]);

  useEffect(() => {
    if (!formData.category) {
      setFilteredPropertyTypes([]);
      return;
    }

    const selectedCategory = categoriesList.find(cat => cat.id === formData.category);
    if (!selectedCategory) {
      setFilteredPropertyTypes([]);
      return;
    }

    const categoryPropertyTypeIds = Array.isArray(selectedCategory.propertyTypes)
      ? selectedCategory.propertyTypes.map(pt => typeof pt === 'string' ? pt : pt.id)
      : [];

    const filtered = propertyTypesList.filter(pt => categoryPropertyTypeIds.includes(pt.id));
    setFilteredPropertyTypes(filtered);
  }, [formData.category, categoriesList, propertyTypesList]);

  useEffect(() => {
    if (property && mode === 'edit') {
      setFormData({
        name: property.name || '',
        description: property.description || '',
        category: '',
        propertyTypes: property.propertyTypes?.map(pt => pt.id) || [],
        status: property.status || '',
        price: property.price?.toString() || '',
        priceFrom: property.priceFrom?.toString() || '',
        priceTo: property.priceTo?.toString() || '',
        size: typeof property.size === 'string' ? property.size : '',
        sizeFrom: property.sizeFrom || '',
        sizeTo: property.sizeTo || '',
        sizeArea: typeof property.sizeArea === 'string' ? property.sizeArea : '',
        beds: property.beds?.toString() || '',
        baths: property.baths?.toString() || '',
        locationIframe: typeof property.locationIframe === 'string' ? property.locationIframe : '',
        handoverBy: typeof property.handoverBy === 'string' ? property.handoverBy : '',
        paymentPlan: property.paymentPlan || '',
        completionDate: property.completionDate ? new Date(property.completionDate) : undefined,
        images: null,
        replaceImages: false,
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        category: '',
        propertyTypes: [],
        status: '',
        price: '',
        priceFrom: '',
        priceTo: '',
        size: '',
        sizeFrom: '',
        sizeTo: '',
        sizeArea: '',
        beds: '',
        baths: '',
        locationIframe: '',
        handoverBy: '',
        paymentPlan: '',
        completionDate: undefined,
        images: null,
        replaceImages: true,
      });
    }
  }, [property, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.status) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate OFF_PLAN specific requirements
    if (formData.status === PropertyStatus.OFF_PLAN) {
      if (!formData.priceFrom || !formData.priceTo || !formData.sizeFrom || !formData.sizeTo) {
        alert('For OFF_PLAN properties, please fill in price range and size range');
        return;
      }
    } else {
      if (!formData.price) {
        alert('Please fill in the price');
        return;
      }
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      submitData.append('name', formData.name.trim());
      submitData.append('status', formData.status);
      
      // For OFF_PLAN, use priceFrom as the base price, otherwise use the regular price
      if (formData.status === PropertyStatus.OFF_PLAN) {
        submitData.append('price', formData.priceFrom);
      } else {
        submitData.append('price', formData.price);
      }
      
      if (formData.priceFrom && formData.priceFrom.trim()) {
        submitData.append('priceFrom', formData.priceFrom);
      }
      
      if (formData.priceTo && formData.priceTo.trim()) {
        submitData.append('priceTo', formData.priceTo);
      }
      
      if (formData.description && formData.description.trim()) {
        submitData.append('description', formData.description.trim());
      }
      
      if (formData.propertyTypes && formData.propertyTypes.length > 0) {
        formData.propertyTypes.forEach((typeId) => {
          submitData.append('propertyTypes[]', typeId);
        });
      }
      
      if (formData.sizeArea && formData.sizeArea.trim()) {
        submitData.append('sizeArea', formData.sizeArea.trim());
      }
      
      if (formData.size && formData.size.trim()) {
        submitData.append('size', formData.size.trim());
      }
      
      if (formData.sizeFrom && formData.sizeFrom.trim()) {
        submitData.append('sizeFrom', formData.sizeFrom.trim());
      }
      
      if (formData.sizeTo && formData.sizeTo.trim()) {
        submitData.append('sizeTo', formData.sizeTo.trim());
      }
      
      if (formData.beds && formData.beds.trim()) {
        submitData.append('beds', formData.beds);
      }
      
      if (formData.baths && formData.baths.trim()) {
        submitData.append('baths', formData.baths);
      }
      
      if (formData.locationIframe && formData.locationIframe.trim()) {
        submitData.append('locationIframe', formData.locationIframe.trim());
      }
      
      if (formData.handoverBy && formData.handoverBy.trim()) {
        submitData.append('handoverBy', formData.handoverBy.trim());
      }
      
      if (formData.paymentPlan && formData.paymentPlan.trim()) {
        submitData.append('paymentPlan', formData.paymentPlan.trim());
      }
      
      if (formData.completionDate) {
        submitData.append('completionDate', formData.completionDate.toISOString());
      }

      if (formData.images && formData.images.length > 0) {
        Array.from(formData.images).forEach((file) => {
          submitData.append('images', file);
        });
      }

      await onSubmit(submitData, property?.id);
      
      if (mode === 'create') {
        setFormData({
          name: '',
          description: '',
          category: '',
          propertyTypes: [],
          status: '',
          price: '',
          priceFrom: '',
          priceTo: '',
          size: '',
          sizeFrom: '',
          sizeTo: '',
          sizeArea: '',
          beds: '',
          baths: '',
          locationIframe: '',
          handoverBy: '',
          paymentPlan: '',
          completionDate: undefined,
          images: null,
          replaceImages: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit property',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: string | Date | FileList | boolean | null | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categoriesList.find(cat => cat.id === categoryId);
    setSelectedCategoryName(category?.name || '');
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      propertyTypes: [],
    }));
  };

  const togglePropertyType = (propertyTypeId: string) => {
    setFormData(prev => {
      const isSelected = prev.propertyTypes.includes(propertyTypeId);
      return {
        ...prev,
        propertyTypes: isSelected
          ? prev.propertyTypes.filter(id => id !== propertyTypeId)
          : [...prev.propertyTypes, propertyTypeId]
      };
    });
  };

  const removePropertyType = (propertyTypeId: string) => {
    setFormData(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.filter(id => id !== propertyTypeId)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-amber-200/20 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-light tracking-wide text-amber-100">
            {mode === 'edit' ? 'Edit Property' : 'Create New Property'}
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-light">
            {mode === 'edit' 
              ? 'Update the property information below.'
              : 'Add a new property to your inventory. Fill in the required information below.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="text-slate-300">Property Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter property name"
                required
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter property description"
                rows={3}
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="category" className="text-slate-300">Category</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-slate-800/60 border-amber-200/20 text-slate-100 focus:border-amber-200/40 focus:ring-amber-200/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-amber-200/20">
                  {loadingCategories ? (
                    <SelectItem value="loading" disabled className="text-slate-400">
                      Loading categories...
                    </SelectItem>
                  ) : categoriesList.length === 0 ? (
                    <SelectItem value="no-categories" disabled className="text-slate-400">
                      No categories available
                    </SelectItem>
                  ) : (
                    categoriesList.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-slate-100 focus:bg-amber-200/10 focus:text-amber-100">
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {formData.category && (
                <p className="text-sm text-slate-400 mt-1">
                  Select property types from the chosen category
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label className="text-slate-300">Property Types</Label>
              <Popover open={isPropertyTypesOpen} onOpenChange={setIsPropertyTypesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPropertyTypesOpen}
                    className="w-full justify-between bg-slate-800/60 border-amber-200/20 text-slate-100 hover:bg-slate-800 hover:border-amber-200/40"
                    disabled={!formData.category}
                  >
                    <span className="truncate">
                      {!formData.category
                        ? "Select a category first..."
                        : formData.propertyTypes.length === 0
                        ? "Select property types..."
                        : `${formData.propertyTypes.length} selected`}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-slate-900 border-amber-200/20" align="start">
                  <div className="max-h-64 overflow-y-auto p-2">
                    {loadingPropertyTypes ? (
                      <div className="p-4 text-center text-sm text-slate-400">
                        Loading property types...
                      </div>
                    ) : filteredPropertyTypes.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-400">
                        {formData.category ? 'No property types in this category' : 'Select a category first'}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filteredPropertyTypes.map((propertyType) => (
                          <div
                            key={propertyType.id}
                            className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-amber-200/10 cursor-pointer text-slate-100"
                            onClick={() => togglePropertyType(propertyType.id)}
                          >
                            <Checkbox
                              checked={formData.propertyTypes.includes(propertyType.id)}
                              onCheckedChange={() => togglePropertyType(propertyType.id)}
                              className="border-amber-200/40 data-[state=checked]:bg-amber-200/20 data-[state=checked]:border-amber-200"
                            />
                            <label className="flex-1 cursor-pointer text-sm">
                              {propertyType.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {formData.propertyTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.propertyTypes.map((typeId) => {
                    const propertyType = filteredPropertyTypes.find(pt => pt.id === typeId);
                    return propertyType ? (
                      <Badge key={typeId} variant="secondary" className="gap-1 bg-amber-200/10 text-amber-100 border-amber-200/20 hover:bg-amber-200/20">
                        {propertyType.name}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-amber-300"
                          onClick={() => removePropertyType(typeId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="status" className="text-slate-300">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-slate-800/60 border-amber-200/20 text-slate-100 focus:border-amber-200/40 focus:ring-amber-200/20">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-amber-200/20">
                  <SelectItem value={PropertyStatus.READY_TO_MOVE} className="text-slate-100 focus:bg-amber-200/10 focus:text-amber-100">Ready to Move</SelectItem>
                  <SelectItem value={PropertyStatus.OFF_PLAN} className="text-slate-100 focus:bg-amber-200/10 focus:text-amber-100">Off Plan</SelectItem>
                  <SelectItem value={PropertyStatus.FOR_RENT} className="text-slate-100 focus:bg-amber-200/10 focus:text-amber-100">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status !== PropertyStatus.OFF_PLAN && (
              <div>
                <Label htmlFor="price" className="text-slate-300">Price (AED) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Enter price"
                  min="0"
                  required
                  className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                />
              </div>
            )}

            {formData.status === PropertyStatus.OFF_PLAN && (
              <>
                <div>
                  <Label htmlFor="priceFrom" className="text-slate-300">Price From (AED) *</Label>
                  <Input
                    id="priceFrom"
                    type="number"
                    value={formData.priceFrom}
                    onChange={(e) => handleInputChange('priceFrom', e.target.value)}
                    placeholder="Enter starting price"
                    min="0"
                    required
                    className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                  />
                </div>

                <div>
                  <Label htmlFor="priceTo" className="text-slate-300">Price To (AED) *</Label>
                  <Input
                    id="priceTo"
                    type="number"
                    value={formData.priceTo}
                    onChange={(e) => handleInputChange('priceTo', e.target.value)}
                    placeholder="Enter ending price"
                    min="0"
                    required
                    className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                  />
                </div>
              </>
            )}

            {formData.status !== PropertyStatus.OFF_PLAN && (
              <div>
                <Label htmlFor="size" className="text-slate-300">Size</Label>
                <Input
                  id="size"
                  type="text"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  placeholder="e.g., 2500 sq ft"
                  className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                />
              </div>
            )}

            {formData.status === PropertyStatus.OFF_PLAN && (
              <>
                <div>
                  <Label htmlFor="sizeFrom" className="text-slate-300">Size From *</Label>
                  <Input
                    id="sizeFrom"
                    type="text"
                    value={formData.sizeFrom}
                    onChange={(e) => handleInputChange('sizeFrom', e.target.value)}
                    placeholder="e.g., 1800 sq ft"
                    required
                    className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                  />
                </div>

                <div>
                  <Label htmlFor="sizeTo" className="text-slate-300">Size To *</Label>
                  <Input
                    id="sizeTo"
                    type="text"
                    value={formData.sizeTo}
                    onChange={(e) => handleInputChange('sizeTo', e.target.value)}
                    placeholder="e.g., 3500 sq ft"
                    required
                    className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                  />
                </div>
              </>
            )}

            {/* Conditional fields based on category */}
            {selectedCategoryName.toLowerCase() === 'commercial' ? (
              <div>
                <Label htmlFor="sizeArea" className="text-slate-300">Area</Label>
                <Input
                  id="sizeArea"
                  type="text"
                  value={formData.sizeArea}
                  onChange={(e) => handleInputChange('sizeArea', e.target.value)}
                  placeholder="e.g., 1200 sq ft"
                  className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                />
              </div>
            ) : selectedCategoryName.toLowerCase() === 'residential' ? (
              <>
                <div>
                  <Label htmlFor="beds" className="text-slate-300">Number of Beds</Label>
                  <Input
                    id="beds"
                    type="number"
                    value={formData.beds}
                    onChange={(e) => handleInputChange('beds', e.target.value)}
                    placeholder="Enter number of bedrooms"
                    min="0"
                    className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                  />
                </div>
                <div>
                  <Label htmlFor="baths" className="text-slate-300">Number of Baths</Label>
                  <Input
                    id="baths"
                    type="number"
                    value={formData.baths}
                    onChange={(e) => handleInputChange('baths', e.target.value)}
                    placeholder="Enter number of bathrooms"
                    min="0"
                    className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                  />
                </div>
              </>
            ) : null}

            {formData.status === PropertyStatus.OFF_PLAN && (
              <>
                <div>
                  <Label htmlFor="handoverBy" className="text-slate-300">Handover By</Label>
                  <Input
                    id="handoverBy"
                    type="text"
                    value={formData.handoverBy}
                    onChange={(e) => handleInputChange('handoverBy', e.target.value)}
                    placeholder="Enter handover information"
                    className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="paymentPlan" className="text-slate-300">Payment Plan</Label>
                  <Textarea
                    id="paymentPlan"
                    value={formData.paymentPlan}
                    onChange={(e) => handleInputChange('paymentPlan', e.target.value)}
                    placeholder="Enter payment plan details"
                    rows={2}
                    className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Completion Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-slate-800/60 border-amber-200/20 text-slate-100 hover:bg-slate-800 hover:border-amber-200/40",
                          !formData.completionDate && "text-slate-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.completionDate ? (
                          format(formData.completionDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-900 border-amber-200/20">
                      <Calendar
                        mode="single"
                        selected={formData.completionDate}
                        onSelect={(date) => handleInputChange('completionDate', date)}
                        initialFocus
                        className="bg-slate-900 text-slate-100"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <Label htmlFor="locationIframe" className="text-slate-300">Location Iframe</Label>
              <Textarea
                id="locationIframe"
                value={formData.locationIframe}
                onChange={(e) => handleInputChange('locationIframe', e.target.value)}
                placeholder="Enter Google Maps iframe embed code"
                rows={2}
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 placeholder:text-slate-500 focus:border-amber-200/40 focus:ring-amber-200/20"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="images" className="text-slate-300">Property Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleInputChange('images', e.target.files)}
                className="bg-slate-800/60 border-amber-200/20 text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-200/20 file:text-amber-100 hover:file:bg-amber-200/30 file:cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-amber-200/10">
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
              {loading 
                ? (mode === 'edit' ? 'Updating...' : 'Creating...') 
                : (mode === 'edit' ? 'Update Property' : 'Create Property')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropertyModal;