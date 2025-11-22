import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, CreditCardIcon, HomeIcon, TagIcon } from "lucide-react";
import { Property, PropertyStatus } from "@/types/property";
import { getPropertyImageUrl } from "@/services/propertyService";
import { useState, useEffect } from "react";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { PropertyType } from "@/types/property-type";
import { propertyTypeService } from "@/services/propertyTypeService";

interface ViewPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

const ViewPropertyModal = ({ isOpen, onClose, property }: ViewPropertyModalProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  if (!property) return null;

  const handleImageClick = (imageUrl: string) => {
    setIsImagePreviewOpen(true);
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
      month: 'long',
      day: 'numeric',
    });
  };
  console.log(propertyTypes)
  return (
    <>
      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        imageUrl={property.images && property.images.length > 0 ? getPropertyImageUrl(property.images[selectedImageIndex]) : ""}
        title={property.name}
      />
      
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto pt-10 bg-slate-900/95 backdrop-blur-xl border border-amber-200/20 text-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl font-serif font-light tracking-wide text-amber-100">
            <span>{property.name}</span>
            <Badge 
              variant={getStatusBadgeVariant(property.status)}
              className="bg-amber-200/10 text-amber-100 border-amber-200/20"
            >
              {property.status}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-light">
            Property details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {property.images && property.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-light tracking-wide text-amber-100">Images ({property.images.length})</h3>
              
              {/* Carousel layout: Big image on top, thumbnails below */}
              <div className="flex flex-col gap-4">
                {/* Main selected image */}
                <div 
                  className="w-full aspect-video bg-slate-800/60 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-amber-200/40 transition-all border border-amber-200/10"
                  onClick={() => handleImageClick(getPropertyImageUrl(property.images[selectedImageIndex]))}
                >
                  <img
                    src={getPropertyImageUrl(property.images[selectedImageIndex])}
                    alt={`${property.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-slate-800/60">
                            <span class="text-slate-400 text-sm">Image ${selectedImageIndex + 1}</span>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>

                {/* Thumbnail strip */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {property.images.map((image, index) => {
                    const imageUrl = getPropertyImageUrl(image);
                    const isSelected = index === selectedImageIndex;
                    return (
                      <div
                        key={index}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer transition-all border-2 ${
                          isSelected 
                            ? 'border-amber-200/60 ring-2 ring-amber-200/40 scale-105' 
                            : 'border-amber-200/10 hover:border-amber-200/30'
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-slate-800/60 text-xs">
                                  <span class="text-slate-400">${index + 1}</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2 font-serif font-light tracking-wide text-amber-100">
                <CreditCardIcon className="w-5 h-5" />
                Main Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="pb-4 border-b border-amber-200/10">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Property Name</p>
                    <p className="text-lg font-medium text-slate-100">{property.name}</p>
                  </div>
                  
                  <div className="pb-4 border-b border-amber-200/10">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Status</p>
                    <Badge 
                      variant={getStatusBadgeVariant(property.status)}
                      className="bg-amber-200/10 text-amber-100 border-amber-200/20"
                    >
                      {property.status}
                    </Badge>
                  </div>
                  
                  <div className="pb-4 border-b border-amber-200/10">
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Price</p>
                    <p className="text-3xl font-bold text-amber-200">{formatPrice(property.price)}</p>
                  </div>

                  {(property.beds !== undefined || property.baths !== undefined) && (
                    <div className="pb-4 border-b border-amber-200/10">
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">Rooms</p>
                      <div className="flex gap-6">
                        {property.beds !== undefined && (
                          <div>
                            <p className="text-sm text-slate-400 mb-1">Bedrooms</p>
                            <p className="text-2xl font-semibold text-slate-100">{property.beds}</p>
                          </div>
                        )}
                        {property.baths !== undefined && (
                          <div>
                            <p className="text-sm text-slate-400 mb-1">Bathrooms</p>
                            <p className="text-2xl font-semibold text-slate-100">{property.baths}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {property.sizeArea && (
                    <div className="pb-4 border-b border-amber-200/10">
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Size Area</p>
                      <p className="text-lg font-medium text-slate-100">{typeof property.sizeArea === 'string' ? property.sizeArea : JSON.stringify(property.sizeArea)}</p>
                    </div>
                  )}
                  
                  {property.size && (
                    <div className="pb-4 border-b border-amber-200/10">
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Size</p>
                      <p className="text-lg font-medium text-slate-100">{typeof property.size === 'string' ? property.size : JSON.stringify(property.size)}</p>
                    </div>
                  )}
                  
                  {property.handoverBy && (
                    <div className="pb-4 border-b border-amber-200/10">
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Handover By</p>
                      <p className="text-lg font-medium text-slate-100">{typeof property.handoverBy === 'string' ? property.handoverBy : JSON.stringify(property.handoverBy)}</p>
                    </div>
                  )}
                  
                  {property.completionDate && (
                    <div className="pb-4 border-b border-amber-200/10">
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Completion Date</p>
                      <p className="text-lg font-medium flex items-center gap-2 text-slate-100">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(property.completionDate)}
                      </p>
                    </div>
                  )}
                  
                  {property.propertyTypes && property.propertyTypes.length > 0 && (
                    <div className="pb-4">
                      <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">Property Types</p>
                      <div className="flex flex-wrap gap-2">
                        {property.propertyTypes.map((type) => (
                          <Badge key={type.id} variant="outline" className="text-sm bg-amber-200/10 text-amber-100 border-amber-200/20 px-3 py-1">
                            {type.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {typeof property.locationIframe === 'string' && property.locationIframe && (
            <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 font-serif font-light tracking-wide text-amber-100">
                  <MapPinIcon className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="w-full h-96 rounded-lg overflow-hidden border border-amber-200/10"
                  dangerouslySetInnerHTML={{ __html: property.locationIframe }}
                />
              </CardContent>
            </Card>
          )}

          {propertyTypes.length > 0 && (
            <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif font-light tracking-wide text-amber-100">Property Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">{propertyTypes.map((type) => type.name).join(', ')}</p>
              </CardContent>
            </Card>
          )}
          {property.description && (
            <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-serif font-light tracking-wide text-amber-100">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>
          )}

          {property.paymentPlan && (
            <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 font-serif font-light tracking-wide text-amber-100">
                  <CreditCardIcon className="w-5 h-5" />
                  Payment Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">{property.paymentPlan}</p>
              </CardContent>
            </Card>
          )}

          {typeof property.locationIframe === 'string' && property.locationIframe && (
            <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 font-serif font-light tracking-wide text-amber-100">
                  <MapPinIcon className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="w-full h-96 rounded-lg overflow-hidden border border-amber-200/10 [&_iframe]:w-full [&_iframe]:h-full"
                  dangerouslySetInnerHTML={{ __html: property.locationIframe }}
                />
              </CardContent>
            </Card>
          )}
          {/* {property.locationIframe && typeof property.locationIframe !== 'string' && (
            <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-200/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 font-serif font-light tracking-wide text-red-400">
                  <MapPinIcon className="w-5 h-5" />
                  Location (Invalid type)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-red-300 bg-slate-800 p-2 rounded overflow-auto max-h-32">
                  {typeof property.locationIframe === 'object' 
                    ? JSON.stringify(property.locationIframe, null, 2)
                    : String(property.locationIframe)
                  }
                </pre>
              </CardContent>
            </Card>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default ViewPropertyModal;