import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, MapPin, Tag, UserPlus } from "lucide-react";


interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  beds?: number;
  baths?: number;
  area?: string;
  size?: string;
  status?: "Ready" | "Off Plan" | "For Rent";
  onClick?: () => void;
  propertyTypes?: string[];
  handoverBy?: string;
  completionDate?: string;
  paymentPlan?: string;
  description?: string;
  showRegister?: boolean;
  onRegisterClick?: () => void;
}

const PropertyCard = ({
  image,
  title,
  price,
  beds,
  baths,
  area,
  size,
  status = "Ready",
  onClick,
  propertyTypes,
  handoverBy,
  completionDate,
  paymentPlan,
  description,
  showRegister = false,
  onRegisterClick,
}: PropertyCardProps) => {
  return (
    <div className="group cursor-pointer h-full" onClick={onClick}>
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-amber-200/20 shadow-[0_4px_16px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.25)] transition-all duration-500 hover:scale-[1.02] h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden h-40 sm:h-48 md:h-52 flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <div className="bg-gradient-to-r from-amber-200 to-amber-100 text-slate-900 px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
              {status}
            </div>
          </div>

          {/* Decorative Corner Element */}
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-amber-200/10 rounded-full blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3 className="text-sm sm:text-base font-serif font-light text-amber-100 mb-2 group-hover:text-amber-200 transition-colors duration-300 tracking-wide line-clamp-2 h-10 sm:h-12 leading-tight">
            {title}
          </h3>
          
          {/* <div className="flex items-center text-slate-400 mb-5 group-hover:text-slate-300 transition-colors">
            <MapPin className="w-4 h-4 mr-2 text-amber-200/60" />
            <span className="text-sm font-light">{location}</span>
          </div> */}


          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-amber-200/10">
            {beds !== undefined && beds > 0 && (
              <div className="flex flex-col items-center p-1 sm:p-1.5 bg-slate-800/40 rounded-lg">
                <Bed className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-200 mb-0.5" />
                <span className="text-[10px] sm:text-[12px] text-slate-300 font-light">{beds} Bed{beds > 1 ? 's' : ''}</span>
              </div>
            )}
            {baths !== undefined && baths > 0 && (
              <div className="flex flex-col items-center p-1 sm:p-1.5 bg-slate-800/40 rounded-lg">
                <Bath className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-200 mb-0.5" />
                <span className="text-[10px] sm:text-[12px] text-slate-300 font-light">{baths} Bath{baths > 1 ? 's' : ''}</span>
              </div>
            )}
            {(size || area) && (
              <div className="flex flex-col items-center p-1 sm:p-1.5 bg-slate-800/40 rounded-lg col-span-2">
                <Maximize className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-200 mb-0.5" />
                <span className="text-[10px] sm:text-[12px] text-slate-300 font-light">
                  {typeof (size || area) === 'string' ? (size || area) : String(size || area)}
                </span>
              </div>
            )}
          </div>

          {/* Location, Handover, Completion, Property Types */}
          <div className="flex flex-wrap gap-0.5 sm:gap-1 mb-1.5 sm:mb-2 min-h-[1.2rem] sm:min-h-[1.5rem]">
            {handoverBy && typeof handoverBy === 'string' && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] text-slate-400 bg-slate-800/40 px-1 sm:px-1.5 py-0.5 rounded">
                <Tag className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-200" /> Handover: {handoverBy}
              </span>
            )}
            {completionDate && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] text-slate-400 bg-slate-800/40 px-1 sm:px-1.5 py-0.5 rounded">
                <Tag className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-200" /> Completion: {new Date(completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
              </span>
            )}
            {propertyTypes && propertyTypes.length > 0 && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] text-slate-400 bg-slate-800/40 px-1 sm:px-1.5 py-0.5 rounded line-clamp-1">
              <Tag className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-200 flex-shrink-0" /> {propertyTypes.join(', ')}
              </span>
            )}
          </div>

          {/* Price and Status */}
          <div className="flex items-baseline justify-between mt-auto">
            <div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-light mb-0.5">Starting from</div>
              <div className="text-base sm:text-lg font-serif font-light bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent">
                {price}
              </div>
            </div>
          </div>

          {/* Payment Plan */}
          {paymentPlan && typeof paymentPlan === 'string' && (
            <div className="mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] text-slate-400 line-clamp-1">
              <span className="font-semibold text-amber-200">Payment Plan:</span> {paymentPlan}
            </div>
          )}

          {/* Description */}
          {description && typeof description === 'string' && (
            <div className="mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] text-slate-400 line-clamp-2">
              {description}
            </div>
          )}

          {/* Register Button */}
          {showRegister && onRegisterClick && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRegisterClick();
              }}
              className="w-full mt-2 sm:mt-3 h-9 sm:h-10 bg-gradient-to-r from-amber-200 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-slate-900 font-semibold text-xs sm:text-sm shadow-[0_2px_8px_rgba(251,191,36,0.3)] hover:shadow-[0_4px_16px_rgba(251,191,36,0.4)] transition-all duration-300"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Register Interest
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
