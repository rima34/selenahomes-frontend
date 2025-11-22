import { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import ViewPropertyModal from "@/components/ViewPropertyModal";
import RegisterModal from "@/components/RegisterModal";
import { PaginationControls } from "@/components/PaginationControls";
import { propertyService, getPropertyImageUrl, PropertyFilter } from "@/services/propertyService";
import type { Property } from "@/types/property";
import { PropertyStatus } from "@/types/property";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface FeaturedPropertiesProps {
  limit?: number;
  showPagination?: boolean;
  showRegister?: boolean;
  filters?: PropertyFilter;
}

const FeaturedProperties = ({ limit = 6, showPagination = true, showRegister = false, filters = {} }: FeaturedPropertiesProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [propertyForRegister, setPropertyForRegister] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await propertyService.getProperties(
          filters,
          {
            page,
            limit,
            sortBy: "createdAt",
            order: "desc",
          }
        );
        setProperties(response.results);
        setTotalPages(response.totalPages);
        setTotalResults(response.totalResults);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Failed to load properties";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, limit, filters]);

  const getFirstImageUrl = (property: Property): string => {
    // Check if property has images array and get first image
    if (property.images && property.images.length > 0) {
      const firstImage = property.images[0];
      // If it's a full URL, return it; otherwise use the proper API endpoint
      if (firstImage.startsWith('http')) {
        return firstImage;
      }
      // Use the utility function to get the correct preview URL
      return getPropertyImageUrl(firstImage);
    }
    // Return a placeholder image if no images available
    return "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop";
  };

  const getStatusLabel = (status: PropertyStatus): "Ready" | "Off Plan" | "For Rent" => {
    if (status === PropertyStatus.READY_TO_MOVE) {
      return "Ready";
    }
    if (status === PropertyStatus.OFF_PLAN) {
      return "Off Plan";
    }
    return "For Rent";
  };

  const handleRegisterClick = (property: Property) => {
    setPropertyForRegister(property);
    setIsRegisterModalOpen(true);
  };
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-amber-200/20 rounded-[2rem] overflow-hidden">
              <Skeleton className="h-72 w-full bg-slate-800/50" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4 bg-slate-800/50" />
                <Skeleton className="h-4 w-1/2 bg-slate-800/50" />
                <div className="grid grid-cols-3 gap-3">
                  <Skeleton className="h-12 bg-slate-800/50 rounded-xl" />
                  <Skeleton className="h-12 bg-slate-800/50 rounded-xl" />
                  <Skeleton className="h-12 bg-slate-800/50 rounded-xl" />
                </div>
                <Skeleton className="h-8 w-2/3 bg-slate-800/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-amber-200/20 rounded-[2rem] p-12 max-w-md mx-auto shadow-[0_4px_16px_rgba(251,191,36,0.15)]">
          <div className="w-20 h-20 bg-amber-200/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-slate-300 text-lg font-light">No properties available at the moment.</p>
          <p className="text-slate-400 text-sm font-light mt-2">Please check back later for new listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ViewPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setPropertyForRegister(null);
        }}
        propertyName={propertyForRegister?.name}
        propertyId={propertyForRegister?.id}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => {
          
          if (typeof property.locationIframe === 'object' && property.locationIframe !== null) {
            console.warn('locationIframe is an object:', property.locationIframe, 'for property:', property.name);
          }
          if (typeof property.sizeArea === 'object' && property.sizeArea !== null) {
            console.warn('sizeArea is an object:', property.sizeArea, 'for property:', property.name);
          }
          if (typeof property.size === 'object' && property.size !== null) {
            console.warn('size is an object:', property.size, 'for property:', property.name);
          }
          if (typeof property.handoverBy === 'object' && property.handoverBy !== null) {
            console.warn('handoverBy is an object:', property.handoverBy, 'for property:', property.name);
          }
          
          return (
            <PropertyCard
              key={property.id}
              image={getFirstImageUrl(property)}
              title={typeof property.name === 'string' ? property.name : 'Untitled Property'}
              location={typeof property.locationIframe === 'string' ? property.locationIframe : "Dubai, UAE"}
              price={`AED ${property.price.toLocaleString()}`}
              beds={typeof property.beds === 'number' ? property.beds : undefined}
              baths={typeof property.baths === 'number' ? property.baths : undefined}
              area={typeof property.sizeArea === 'string' ? property.sizeArea : undefined}
              size={typeof property.size === 'string' ? property.size : undefined}
              status={getStatusLabel(property.status)}
              onClick={() => {
                setSelectedProperty(property);
                setIsModalOpen(true);
              }}
              showRegister={showRegister}
              onRegisterClick={() => handleRegisterClick(property)}
            />
          );
        })}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex justify-center">
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            totalResults={totalResults}
            itemsPerPage={limit}
            onPageChange={setPage}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default FeaturedProperties;
