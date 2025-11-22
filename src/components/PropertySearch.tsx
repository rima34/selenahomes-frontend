import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { PropertyStatus } from "@/types/property";
import { propertyTypeService } from "@/services/propertyTypeService";
import { PropertyFilter } from "@/services/propertyService";
import type { Category } from "@/types/property-type";
import { format } from "date-fns";

interface PropertySearchProps {
  onSearch?: (filters: PropertyFilter) => void;
}

const PropertySearch = ({ onSearch }: PropertySearchProps) => {
  const [status, setStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("Residential");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [beds, setBeds] = useState<string>("");
  const [baths, setBaths] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [completionDateFrom, setCompletionDateFrom] = useState<Date | undefined>(undefined);
  const [completionDateTo, setCompletionDateTo] = useState<Date | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isBedsOpen, setIsBedsOpen] = useState(false);
  const [isBathsOpen, setIsBathsOpen] = useState(false);
  const [isCompletionDateOpen, setIsCompletionDateOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await propertyTypeService.getCategories({}, { limit: 100 });
        setCategories(response.results);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    const filters: PropertyFilter = {};

    if (status && status !== "all") {
      filters.status = status;
    }

    if (searchTerm) {
      filters.name = searchTerm;
    }

    if (selectedPropertyTypes.length > 0) {
      filters.propertyTypes = selectedPropertyTypes;
    }

    // Off Plan specific filters
    if (status === PropertyStatus.OFF_PLAN) {
      if (completionDateFrom) {
        filters.completionDateFrom = format(completionDateFrom, 'yyyy-MM-dd');
      }
      if (completionDateTo) {
        filters.completionDateTo = format(completionDateTo, 'yyyy-MM-dd');
      }
    } else {
      if (beds && beds !== "any") {
        if (beds === "8+") {
          filters.bedsGt = 8;
        } else if (beds === "Studio") {
          filters.beds = 0;
        } else {
          filters.beds = parseInt(beds);
        }
      }
      if (baths && baths !== "any") {
        if (baths === "6+") {
          filters.bathsGt = 6;
        } else {
          filters.baths = parseInt(baths);
        }
      }
    }

    // Price filters (always available)
    if (minPrice) {
      const min = Math.max(0, parseInt(minPrice));
      if (!isNaN(min)) filters.minPrice = min;
    }
    if (maxPrice) {
      const max = Math.max(0, parseInt(maxPrice));
      if (!isNaN(max)) filters.maxPrice = max;
    }

    onSearch?.(filters);
  };

  const handlePropertyTypeToggle = (typeId: string) => {
    setSelectedPropertyTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleReset = () => {
    setStatus("all");
    setSelectedPropertyTypes([]);
    setBeds("");
    setBaths("");
    setMinPrice("");
    setMaxPrice("");
    setCompletionDateFrom(undefined);
    setCompletionDateTo(undefined);
    setSearchTerm("");
    onSearch?.({});
  };

  const isOffPlan = status === PropertyStatus.OFF_PLAN;
  const currentCategory = categories.find(cat => cat.name === selectedCategory);
  const propertyTypes = currentCategory?.propertyTypes || [];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
      <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-2xl p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-[0_8px_32px_0_rgba(251,191,36,0.2)] border border-amber-200/30">
        {/* Search Input and Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-200 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:pl-12 h-11 sm:h-12 bg-slate-800/60 border-amber-200/30 text-white placeholder:text-slate-400 rounded-xl text-xs sm:text-sm focus:border-amber-200 focus:ring-2 focus:ring-amber-200/30 transition-all duration-300 shadow-inner"
            />
          </div>
          
          <div className="flex gap-2 sm:gap-3">
            <Button 
              onClick={handleReset}
              className="flex-1 sm:flex-none h-11 sm:h-12 px-4 sm:px-6 bg-slate-800/60 border border-amber-200/30 text-amber-200 rounded-xl font-semibold text-xs sm:text-sm hover:bg-slate-900/80 hover:text-white transition-all duration-300"
              type="button"
            >
              Reset
            </Button>
            <Button 
              onClick={handleSearch}
              className="flex-1 sm:flex-none h-11 sm:h-12 px-6 sm:px-8 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:shadow-[0_6px_24px_rgba(251,191,36,0.4)] transition-all duration-300"
              type="button"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
          {/* Status Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            {["All", "Ready", "Off Plan"].map((statusOption) => {
              const statusValue = 
                statusOption === "All" ? "all" :
                statusOption === "Ready" ? PropertyStatus.READY_TO_MOVE :
                PropertyStatus.OFF_PLAN;
              const isActive = status === statusValue;
              
              return (
                <Button
                  key={statusOption}
                  variant="outline"
                  onClick={() => setStatus(statusValue)}
                  className={`h-12 sm:h-14 px-4 sm:px-8 rounded-xl text-sm sm:text-base whitespace-nowrap flex-1 sm:flex-initial transition-all ${
                    isActive
                      ? "bg-amber-600 border-amber-500 text-white hover:bg-amber-500"
                      : "bg-slate-800/40 border-slate-600/30 text-slate-300 hover:bg-slate-700/60"
                  }`}
                >
                  {statusOption}
                </Button>
              );
            })}
          </div>

          {/* Property Type Dropdown */}
          <Popover open={isPropertyTypeOpen} onOpenChange={setIsPropertyTypeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-12 sm:h-14 px-4 sm:px-6 bg-slate-800/40 border-slate-600/30 text-slate-300 rounded-xl text-sm sm:text-base hover:bg-slate-700/60 w-full sm:w-auto sm:min-w-[180px] justify-between"
              >
                <span className="truncate">
                  {selectedPropertyTypes.length > 0
                    ? `${selectedPropertyTypes.length} Type${selectedPropertyTypes.length > 1 ? 's' : ''}`
                    : "Type"}
                </span>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[600px] p-3 sm:p-4 bg-slate-900/95 backdrop-blur-xl border-amber-200/20"  align="start">
              {/* Category Tabs */}
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-3 sm:mb-4">
                <TabsList className="bg-transparent border-b border-amber-200/20 rounded-none w-full justify-start h-auto p-0 overflow-x-auto flex-nowrap">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.name}
                      className="data-[state=active]:bg-transparent data-[state=active]:text-amber-200 data-[state=active]:border-b-2 data-[state=active]:border-amber-200 text-slate-400 border-b-2 border-transparent rounded-none px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Property Types Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {Array.isArray(propertyTypes) && propertyTypes.map((type: string | { id: string; name: string }) => {
                  const typeId = typeof type === 'string' ? type : type.id;
                  const typeName = typeof type === 'string' ? type : type.name;
                  const isSelected = selectedPropertyTypes.includes(typeId);
                  
                  return (
                    <Button
                      key={typeId}
                      variant="outline"
                      onClick={() => handlePropertyTypeToggle(typeId)}
                      className={`h-8 sm:h-10 rounded-full text-[10px] sm:text-xs transition-all ${
                        isSelected
                          ? "bg-amber-200/10 border-amber-200/40 text-amber-100 hover:bg-amber-200/20"
                          : "bg-slate-800/40 border-slate-600/30 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500/40"
                      }`}
                    >
                      <span className="truncate">{typeName}</span>
                    </Button>
                  );
                })}
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-amber-200/20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPropertyTypes([]);
                  }}
                  className="bg-transparent border-amber-200/30 text-slate-300 hover:bg-slate-800/60"
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsPropertyTypeOpen(false)}
                  className="bg-amber-600 hover:bg-amber-500 text-white"
                >
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Completion Date Dropdown for Off Plan */}
          {isOffPlan && (
            <Popover open={isCompletionDateOpen} onOpenChange={setIsCompletionDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 sm:h-14 px-4 sm:px-6 bg-slate-800/40 border-slate-600/30 text-slate-300 rounded-xl text-sm sm:text-base hover:bg-slate-700/60 w-full sm:w-auto sm:min-w-[220px] justify-between"
                >
                  <span className="truncate">
                    {completionDateFrom || completionDateTo
                      ? `${completionDateFrom ? format(completionDateFrom, 'MMM yy') : 'Start'} - ${completionDateTo ? format(completionDateTo, 'MMM yy') : 'End'}`
                      : "Completion"}
                  </span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] sm:w-auto p-0 bg-slate-900/95 backdrop-blur-xl border-amber-200/20" align="start">
                <div className="p-4">
                  <div className="text-sm font-semibold text-slate-200 mb-3">Completion Date Range</div>
                  <div className="space-y-4">
                    {/* From Date */}
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block">From</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-slate-700/60 border-amber-200/20 text-white hover:bg-slate-700/80 h-9 rounded-lg text-xs"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-amber-200" />
                            {completionDateFrom ? format(completionDateFrom, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900/95 backdrop-blur-xl border-amber-200/20" align="start">
                          <Calendar
                            mode="single"
                            selected={completionDateFrom}
                            onSelect={setCompletionDateFrom}
                            disabled={(date) => completionDateTo ? date > completionDateTo : false}
                            initialFocus
                            className="rounded-lg"
                            classNames={{
                              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                              month: "space-y-4",
                              caption: "flex justify-center pt-1 relative items-center text-amber-200",
                              caption_label: "text-sm font-medium",
                              nav: "space-x-1 flex items-center",
                              nav_button: "h-7 w-7 bg-slate-800/60 border border-amber-200/30 p-0 text-amber-200 hover:bg-amber-200/10 hover:text-amber-100 rounded-lg",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell: "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "h-9 w-9 text-center text-sm p-0 relative rounded-md",
                              day: "h-9 w-9 p-0 font-normal text-slate-300 hover:bg-amber-200/10 hover:text-amber-100 rounded-lg",
                              day_selected: "bg-amber-600 text-white hover:bg-amber-500 hover:text-white focus:bg-amber-600 focus:text-white rounded-lg",
                              day_today: "bg-slate-700/60 text-amber-200 rounded-lg",
                              day_outside: "text-slate-600 opacity-50",
                              day_disabled: "text-slate-600 opacity-50",
                              day_range_middle: "aria-selected:bg-amber-200/10 aria-selected:text-amber-100",
                              day_hidden: "invisible",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* To Date */}
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block">To</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-slate-700/60 border-amber-200/20 text-white hover:bg-slate-700/80 h-9 rounded-lg text-xs"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-amber-200" />
                            {completionDateTo ? format(completionDateTo, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900/95 backdrop-blur-xl border-amber-200/20" align="start">
                          <Calendar
                            mode="single"
                            selected={completionDateTo}
                            onSelect={setCompletionDateTo}
                            disabled={(date) => completionDateFrom ? date < completionDateFrom : false}
                            initialFocus
                            className="rounded-lg"
                            classNames={{
                              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                              month: "space-y-4",
                              caption: "flex justify-center pt-1 relative items-center text-amber-200",
                              caption_label: "text-sm font-medium",
                              nav: "space-x-1 flex items-center",
                              nav_button: "h-7 w-7 bg-slate-800/60 border border-amber-200/30 p-0 text-amber-200 hover:bg-amber-200/10 hover:text-amber-100 rounded-lg",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell: "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "h-9 w-9 text-center text-sm p-0 relative rounded-md",
                              day: "h-9 w-9 p-0 font-normal text-slate-300 hover:bg-amber-200/10 hover:text-amber-100 rounded-lg",
                              day_selected: "bg-amber-600 text-white hover:bg-amber-500 hover:text-white focus:bg-amber-600 focus:text-white rounded-lg",
                              day_today: "bg-slate-700/60 text-amber-200 rounded-lg",
                              day_outside: "text-slate-600 opacity-50",
                              day_disabled: "text-slate-600 opacity-50",
                              day_range_middle: "aria-selected:bg-amber-200/10 aria-selected:text-amber-100",
                              day_hidden: "invisible",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end p-4 pt-0 border-t border-amber-200/20">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCompletionDateFrom(undefined);
                      setCompletionDateTo(undefined);
                    }}
                    className="bg-transparent border-amber-200/30 text-slate-300 hover:bg-slate-800/60"
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsCompletionDateOpen(false)}
                    className="bg-amber-600 hover:bg-amber-500 text-white"
                  >
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Beds & Baths Dropdown */}
          {!isOffPlan && (
            <Popover open={isBedsOpen} onOpenChange={setIsBedsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 sm:h-14 px-4 sm:px-6 bg-slate-800/40 border-slate-600/30 text-slate-300 rounded-xl text-sm sm:text-base hover:bg-slate-700/60 w-full sm:w-auto sm:min-w-[180px] justify-between"
                >
                  <span className="truncate">
                    {beds || baths 
                      ? `${beds || ''}${beds && baths ? '/' : ''}${baths || ''}`
                      : "Bed/Bath"}
                  </span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] p-3 sm:p-4 bg-slate-900/95 backdrop-blur-xl border-amber-200/20" align="start">
                {/* Beds Section */}
                <div className="mb-3 sm:mb-4">
                  <div className="text-xs sm:text-sm font-semibold text-slate-200 mb-2 sm:mb-3">Beds</div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {["Studio", "1", "2", "3", "4", "5", "6", "7", "8+"].map((bed) => (
                      <Button
                        key={bed}
                        variant="outline"
                        onClick={() => setBeds(beds === bed ? "" : bed)}
                        className={`h-8 sm:h-9 rounded-full text-[10px] sm:text-xs transition-all ${
                          beds === bed
                            ? "bg-amber-200/10 border-amber-200/40 text-amber-100"
                            : "bg-slate-800/40 border-slate-600/30 text-slate-300 hover:bg-slate-700/60"
                        }`}
                      >
                        {bed}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Baths Section */}
                <div className="mb-3">
                  <div className="text-xs sm:text-sm font-semibold text-slate-200 mb-2 sm:mb-3">Baths</div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {["1", "2", "3", "4", "5", "6+"].map((bath) => (
                      <Button
                        key={bath}
                        variant="outline"
                        onClick={() => setBaths(baths === bath ? "" : bath)}
                        className={`h-8 sm:h-9 rounded-full text-[10px] sm:text-xs transition-all ${
                          baths === bath
                            ? "bg-amber-200/10 border-amber-200/40 text-amber-100"
                            : "bg-slate-800/40 border-slate-600/30 text-slate-300 hover:bg-slate-700/60"
                        }`}
                      >
                        {bath}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-amber-200/20">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setBeds("");
                      setBaths("");
                    }}
                    className="bg-transparent border-amber-200/30 text-slate-300 hover:bg-slate-800/60"
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsBedsOpen(false)}
                    className="bg-amber-600 hover:bg-amber-500 text-white"
                  >
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Price Dropdown */}
          <Popover open={isBathsOpen} onOpenChange={setIsBathsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-12 sm:h-14 px-4 sm:px-6 bg-slate-800/40 border-slate-600/30 text-slate-300 rounded-xl text-sm sm:text-base hover:bg-slate-700/60 w-full sm:w-auto sm:min-w-[180px] justify-between"
              >
                <span className="truncate">
                  {minPrice || maxPrice
                    ? `${minPrice || '0'} - ${maxPrice || '∞'}`
                    : "Price"}
                </span>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex-shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[350px] p-3 sm:p-4 bg-slate-900/95 backdrop-blur-xl border-amber-200/20" align="start">
              <div className="mb-3">
                <div className="text-xs sm:text-sm font-semibold text-slate-200 mb-2 sm:mb-3">Price Range (AED)</div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^[0-9]+$/.test(val)) setMinPrice(val);
                    }}
                    className="h-8 sm:h-9 bg-slate-700/60 border-amber-200/20 text-white rounded-lg text-xs"
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^[0-9]+$/.test(val)) setMaxPrice(val);
                    }}
                    className="h-8 sm:h-9 bg-slate-700/60 border-amber-200/20 text-white rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-amber-200/20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="bg-transparent border-amber-200/30 text-slate-300 hover:bg-slate-800/60"
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsBathsOpen(false)}
                  className="bg-amber-600 hover:bg-amber-500 text-white"
                >
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default PropertySearch;
