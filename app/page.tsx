"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  filterUniversities,
  getFilterOptions,
  getBestValueUniversities,
  type UniversityFilters,
  type FilterOptions,
} from "@/actions/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, X, TrendingUp, Sparkles, Filter } from "lucide-react";
import toast from "react-hot-toast";

interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  tuitionFee: number;
  ranking: number;
  establishedYear: number;
}

export default function UniversityFinderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // State for universities and filter options
  const [universities, setUniversities] = useState<University[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // Filter state
  const [filters, setFilters] = useState<UniversityFilters>({
    country: "all",
    city: "all",
    searchQuery: "",
    sortBy: "ranking",
    sortOrder: "asc",
  });

  // Tuition and ranking sliders
  const [tuitionRange, setTuitionRange] = useState<[number, number]>([0, 100000]);
  const [rankingRange, setRankingRange] = useState<[number, number]>([1, 1000]);
  const [yearRange, setYearRange] = useState<[number, number]>([1800, 2025]);

  // Compare feature state
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Quick filter state
  const [quickFilter, setQuickFilter] = useState<string>("all");

  // Load filter options on mount
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const options = await getFilterOptions();
        setFilterOptions(options);

        // Initialize slider ranges based on actual data
        setTuitionRange([options.tuitionRange.min, options.tuitionRange.max]);
        setRankingRange([options.rankingRange.min, options.rankingRange.max]);
        setYearRange([options.establishedRange.min, options.establishedRange.max]);

        // Update filters with actual ranges
        setFilters((prev) => ({
          ...prev,
          minTuition: options.tuitionRange.min,
          maxTuition: options.tuitionRange.max,
          minRanking: options.rankingRange.min,
          maxRanking: options.rankingRange.max,
          minEstablished: options.establishedRange.min,
          maxEstablished: options.establishedRange.max,
        }));
      } catch (error) {
        toast.error("Failed to load filter options");
      }
    }
    loadFilterOptions();
  }, []);

  // Fetch universities based on filters
  async function fetchUniversities(currentFilters: UniversityFilters) {
    setIsLoading(true);
    try {
      const result = await filterUniversities(currentFilters);
      if (result.status === 200) {
        setUniversities(result.data);
      } else {
        toast.error(result.error || "Failed to load universities");
      }
    } catch (error) {
      toast.error("An error occurred while filtering universities");
    } finally {
      setIsLoading(false);
    }
  }

  // Initial load and when filters change
  useEffect(() => {
    if (filterOptions) {
      fetchUniversities(filters);
    }
  }, [filters, filterOptions]);

  // Update filters
  const updateFilter = (key: keyof UniversityFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle tuition slider change
  const handleTuitionChange = (values: number[]) => {
    setTuitionRange([values[0], values[1]]);
    setFilters((prev) => ({
      ...prev,
      minTuition: values[0],
      maxTuition: values[1],
    }));
  };

  // Handle ranking slider change
  const handleRankingChange = (values: number[]) => {
    setRankingRange([values[0], values[1]]);
    setFilters((prev) => ({
      ...prev,
      minRanking: values[0],
      maxRanking: values[1],
    }));
  };

  // Handle year slider change
  const handleYearChange = (values: number[]) => {
    setYearRange([values[0], values[1]]);
    setFilters((prev) => ({
      ...prev,
      minEstablished: values[0],
      maxEstablished: values[1],
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    if (!filterOptions) return;

    setFilters({
      country: "all",
      city: "all",
      searchQuery: "",
      sortBy: "ranking",
      sortOrder: "asc",
      minTuition: filterOptions.tuitionRange.min,
      maxTuition: filterOptions.tuitionRange.max,
      minRanking: filterOptions.rankingRange.min,
      maxRanking: filterOptions.rankingRange.max,
      minEstablished: filterOptions.establishedRange.min,
      maxEstablished: filterOptions.establishedRange.max,
    });
    setTuitionRange([filterOptions.tuitionRange.min, filterOptions.tuitionRange.max]);
    setRankingRange([filterOptions.rankingRange.min, filterOptions.rankingRange.max]);
    setYearRange([filterOptions.establishedRange.min, filterOptions.establishedRange.max]);
    setQuickFilter("all");
  };

  // Quick filter presets
  const handleQuickFilter = async (filterType: string) => {
    setQuickFilter(filterType);

    switch (filterType) {
      case "best-value":
        startTransition(async () => {
          const result = await getBestValueUniversities(20);
          if (result.status === 200) {
            setUniversities(result.data);
            toast.success("Showing best value universities");
          }
        });
        break;
      case "top-ranked":
        setFilters((prev) => ({
          ...prev,
          minRanking: filterOptions?.rankingRange.min || 1,
          maxRanking: 100,
          sortBy: "ranking",
          sortOrder: "asc",
        }));
        setRankingRange([filterOptions?.rankingRange.min || 1, 100]);
        break;
      case "affordable":
        setFilters((prev) => ({
          ...prev,
          minTuition: filterOptions?.tuitionRange.min || 0,
          maxTuition: 20000,
          sortBy: "tuitionFee",
          sortOrder: "asc",
        }));
        setTuitionRange([filterOptions?.tuitionRange.min || 0, 20000]);
        break;
      case "historic":
        setFilters((prev) => ({
          ...prev,
          minEstablished: filterOptions?.establishedRange.min || 1800,
          maxEstablished: new Date().getFullYear() - 100,
          sortBy: "establishedYear",
          sortOrder: "asc",
        }));
        setYearRange([filterOptions?.establishedRange.min || 1800, new Date().getFullYear() - 100]);
        break;
      default:
        resetFilters();
    }
  };

  // Toggle university selection for comparison
  const toggleUniversitySelection = (id: string) => {
    setSelectedUniversities((prev) => {
      if (prev.includes(id)) {
        return prev.filter((universityId) => universityId !== id);
      } else {
        if (prev.length >= 2) {
          toast.error("You can only compare 2 universities at a time");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // Compare selected universities
  const compareUniversities = () => {
    if (selectedUniversities.length !== 2) {
      toast.error("Please select exactly 2 universities to compare");
      return;
    }
    setShowCompareModal(true);
  };

  // Get cities based on selected country
  const filteredCities = useMemo(() => {
    if (!filterOptions) return [];
    if (filters.country === "all") return filterOptions.cities;

    // This would ideally be a server call, but for client-side filtering:
    return filterOptions.cities;
  }, [filters.country, filterOptions]);

  const compareData = useMemo(() => {
    return universities.filter((u) => selectedUniversities.includes(u.id));
  }, [selectedUniversities, universities]);

  if (!filterOptions) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading filters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Find Your Perfect University</h1>
        <p className="text-muted-foreground">
          Explore {universities.length} universities worldwide with advanced filters
        </p>
      </div>

      {/* Quick Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Quick Filters</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={quickFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("all")}
          >
            All Universities
          </Button>
          <Button
            variant={quickFilter === "best-value" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("best-value")}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Best Value
          </Button>
          <Button
            variant={quickFilter === "top-ranked" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("top-ranked")}
          >
            Top 100 Ranked
          </Button>
          <Button
            variant={quickFilter === "affordable" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("affordable")}
          >
            Affordable (Under $20k)
          </Button>
          <Button
            variant={quickFilter === "historic" ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter("historic")}
          >
            Historic (100+ years)
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? "" : "hidden lg:block"}`}>
          <Card className="p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search universities..."
                    value={filters.searchQuery || ""}
                    onChange={(e) => updateFilter("searchQuery", e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={filters.country}
                  onValueChange={(value) => updateFilter("country", value)}
                >
                  <SelectTrigger id="country" className="mt-1">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {filterOptions.countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city">City</Label>
                <Select
                  value={filters.city}
                  onValueChange={(value) => updateFilter("city", value)}
                >
                  <SelectTrigger id="city" className="mt-1">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {filteredCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tuition Fee Range */}
              <div>
                <Label>
                  Tuition Fee: ${tuitionRange[0].toLocaleString()} - $
                  {tuitionRange[1].toLocaleString()}
                </Label>
                <Slider
                  min={filterOptions.tuitionRange.min}
                  max={filterOptions.tuitionRange.max}
                  step={1000}
                  value={tuitionRange}
                  onValueChange={handleTuitionChange}
                  className="mt-2"
                />
              </div>

              {/* Ranking Range */}
              <div>
                <Label>
                  Ranking: {rankingRange[0]} - {rankingRange[1]}
                </Label>
                <Slider
                  min={filterOptions.rankingRange.min}
                  max={filterOptions.rankingRange.max}
                  step={10}
                  value={rankingRange}
                  onValueChange={handleRankingChange}
                  className="mt-2"
                />
              </div>

              {/* Established Year Range */}
              <div>
                <Label>
                  Established: {yearRange[0]} - {yearRange[1]}
                </Label>
                <Slider
                  min={filterOptions.establishedRange.min}
                  max={filterOptions.establishedRange.max}
                  step={5}
                  value={yearRange}
                  onValueChange={handleYearChange}
                  className="mt-2"
                />
              </div>

              {/* Sort */}
              <div>
                <Label htmlFor="sort">Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: any) => updateFilter("sortBy", value)}
                >
                  <SelectTrigger id="sort" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ranking">Ranking</SelectItem>
                    <SelectItem value="tuitionFee">Tuition Fee</SelectItem>
                    <SelectItem value="establishedYear">Year Established</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div>
                <Label htmlFor="order">Order</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: any) => updateFilter("sortOrder", value)}
                >
                  <SelectTrigger id="order" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="lg:hidden mb-4 w-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>

          {/* Compare Button */}
          {selectedUniversities.length > 0 && (
            <Card className="p-4 mb-4 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedUniversities.length} selected
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedUniversities.length === 2
                      ? "Ready to compare"
                      : "Select one more to compare"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUniversities([])}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={compareUniversities}
                    disabled={selectedUniversities.length !== 2}
                  >
                    Compare
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Results Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {isLoading ? "Loading..." : `${universities.length} Universities Found`}
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Searching universities...</div>
              </div>
            ) : universities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <X className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No universities found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Tuition</TableHead>
                      <TableHead>Ranking</TableHead>
                      <TableHead>Established</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {universities.map((university) => (
                      <TableRow key={university.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUniversities.includes(university.id)}
                            onCheckedChange={() =>
                              toggleUniversitySelection(university.id)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{university.name}</div>
                          {university.ranking <= 100 && (
                            <Badge variant="secondary" className="mt-1">
                              Top 100
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>{university.city}</div>
                          <div className="text-sm text-muted-foreground">
                            {university.country}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            ${university.tuitionFee.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">/year</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              university.ranking <= 100
                                ? "default"
                                : university.ranking <= 500
                                ? "secondary"
                                : "outline"
                            }
                          >
                            #{university.ranking}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>{university.establishedYear}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date().getFullYear() - university.establishedYear} years
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Compare Modal */}
      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Compare Universities</DialogTitle>
            <DialogDescription>
              Side-by-side comparison of your selected universities
            </DialogDescription>
          </DialogHeader>

          {compareData.length === 2 && (
            <div className="grid grid-cols-2 gap-6 mt-4">
              {compareData.map((university) => (
                <Card key={university.id} className="p-6">
                  <h3 className="text-xl font-bold mb-4">{university.name}</h3>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div className="font-medium">
                        {university.city}, {university.country}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Tuition Fee</div>
                      <div className="font-medium text-lg">
                        ${university.tuitionFee.toLocaleString()}/year
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Ranking</div>
                      <div>
                        <Badge variant="default">#{university.ranking}</Badge>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Established</div>
                      <div className="font-medium">
                        {university.establishedYear} (
                        {new Date().getFullYear() - university.establishedYear} years old)
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold mb-3">Key Differences</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tuition Difference:</span>
                <span className="font-medium">
                  $
                  {Math.abs(
                    compareData[0]?.tuitionFee - compareData[1]?.tuitionFee
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ranking Difference:</span>
                <span className="font-medium">
                  {Math.abs(compareData[0]?.ranking - compareData[1]?.ranking)} positions
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Age Difference:</span>
                <span className="font-medium">
                  {Math.abs(
                    compareData[0]?.establishedYear - compareData[1]?.establishedYear
                  )}{" "}
                  years
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}